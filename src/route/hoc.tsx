import React from "react"
import type { RouteProps } from "react-router"
import { ParamsValidation, QueryParamsValidation } from "../validations"
import type {
  RouteHOCProps,
  Params,
  RouteLink,
  QueryParams,
  RoutePath,
  GetPath,
  RetunFunctionType
} from "../types"
import { generateLink } from "../links"
import { getParams, getQueryParams } from "../utils"
import { isComponent, routeComponentFactory, isFunction } from "./utils"

Route.params = new ParamsValidation()
Route.query = new QueryParamsValidation()

export function Route<Props>(
  WrappedComponent: React.FC<Props & RouteHOCProps>
): React.FC<Props & RouteProps>
export function Route<Path extends string>(
  path: Path
): <Props>(
  WrappedComponent: React.FC<Props & RouteHOCProps<Path>>
) => React.FC<Props & RouteProps> & {
  link: RouteLink<Path>
}
export function Route<
  Validation extends {
    [x: string]: ParamsValidation<any> | QueryParamsValidation<any>
  },
  Path extends RoutePath<Params<Validation>>
>(
  validation: Validation,
  path: Path
): <Props>(
  WrappedComponent: React.FC<
    Props &
      RouteHOCProps<GetPath<Path>, Params<Validation>, QueryParams<Validation>>
  >
) => React.FC<Props & RouteProps> & {
  link: RouteLink<GetPath<Path>, Params<Validation>, QueryParams<Validation>>
}
export function Route<
  ValidationOrComponent =
    | { [x: string]: ParamsValidation<any> | QueryParamsValidation<any> }
    | React.FC
    | string,
  Path extends RoutePath<Params<ValidationOrComponent>> = any
>(validationOrComponent?: ValidationOrComponent, path?: Path): any {
  if (isComponent(validationOrComponent)) {
    const RouteComponent = routeComponentFactory(validationOrComponent)
    RouteComponent.displayName = "RouteHOC"
    return RouteComponent
  }

  return (
    WrappedComponent: React.FC
  ): React.FC & { link: RouteLink<RetunFunctionType<Path>> } => {
    let routePath: string | undefined
    let toPath: any
    /**
     * When user provide route params and path factory
     */
    if (typeof validationOrComponent === "object") {
      const pathParams = getParams(validationOrComponent)
      const queryParams = getQueryParams(validationOrComponent)
      if (!pathParams || Object.keys(pathParams).length && typeof path === "string") {
        throw new Error(
          `You haven't provided path function as a second argument`
        )
      }
      routePath = isFunction(path) ? path(pathParams) : path?.toString()
      toPath = generateLink(routePath, pathParams, queryParams)
    }
    /**
     * When user provide only route path
     */
    if (typeof validationOrComponent === "string") {
      routePath = validationOrComponent
      toPath = generateLink(routePath)
    }

    /**
     * Generated Route with route props & own props
     */
    const validation: {[x: string]:  any} | undefined = typeof validationOrComponent === 'object' ? validationOrComponent : undefined
    const RouteFC = routeComponentFactory(
      WrappedComponent,
      validation
    )

    RouteFC.link = toPath
    RouteFC.defaultProps = {
      path: routePath
    }
    let wrappedName = WrappedComponent.displayName || WrappedComponent.name
    Object.defineProperty(RouteFC, "displayName", {
      get() {
        return "RouteHOC".concat(wrappedName ? `(${wrappedName})` : "")
      },
      set(value: string) {
        wrappedName = value
      }
    })
    return RouteFC as any
  }
}
