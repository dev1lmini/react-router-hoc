import React from "react"
import { Route as ReactRoute } from "react-router"
import type { RouteProps } from "react-router"
import { compile } from "path-to-regexp"
import { ParamsValidation, QueryParamsValidation } from "./validations"
import type { RouteHOCProps, Params, RouteLink, QueryParams } from "./types"

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
  Path extends (values: Params<Validation>) => string
>(
  validation: Validation,
  path: Path
): <Props>(
  WrappedComponent: React.FC<
    Props & RouteHOCProps<ReturnType<Path>, Params<Validation>, QueryParams<Validation>>
  >
) => React.FC<Props & RouteProps> & {
  link: RouteLink<ReturnType<Path>, Params<Validation>>
}
export function Route<Validation = any, Path = any>(
  validation?: Validation,
  path?: Path
): any {
  if (typeof validation === "function") {
    const WrappedComponent = validation

    const RouteFC: React.FC<RouteProps> = ({
      location,
      component,
      render,
      children,
      path,
      exact,
      sensitive,
      strict,
      ...props
    }) => {
      const routeProps = {
        location,
        component,
        render,
        children,
        exact,
        sensitive,
        strict,
        path
      }

      return (
        <ReactRoute
          {...routeProps}
          render={routeProps => <WrappedComponent {...props} {...routeProps} />}
        />
      )
    }

    RouteFC.displayName = "RouteHOC"
    return RouteFC
  }
  return function (WrappedComponent: any): any {
    let routePath: string | undefined

    /**
     * When user provide route params and path factory
     */
    if (typeof validation === "object") {
      const paramsPath = Object.entries(validation).reduce<Params<Validation>>(
        (acc, [key, item]) => ({
          ...acc,
          [key]: item.generateRules(key)
        }),
        {} as Params<Validation>
      )
      if (typeof path === "function") {
        routePath = path(paramsPath)
      } else {
        throw new Error(
          `You haven't provided path function as a second argument`
        )
      }
    }
    /**
     * When user provide only route path
     */
    if (typeof validation === "string") {
      routePath = validation
    }
    const toPath = routePath
      ? compile(routePath, { encode: encodeURIComponent })
      : () => undefined as any
    /**
     * Generated Route with route props & own props
     */
    const RouteFC: React.FC<RouteProps> & {
      link: (params: Params<Validation>) => string
    } = ({
      location,
      component,
      render,
      children,
      path: _path = routePath,
      exact,
      sensitive,
      strict,
      ...props
    }) => {
      const routeProps = {
        location,
        component,
        render,
        children,
        exact,
        sensitive,
        strict,
        path: routePath
      }

      return (
        <ReactRoute
          {...routeProps}
          render={routeProps => (
            <WrappedComponent link={toPath} {...props} {...routeProps} />
          )}
        />
      )
    }

    RouteFC.link = toPath
    RouteFC.defaultProps = {
      path: routePath
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name
    RouteFC.displayName = "RouteHOC".concat(
      wrappedName ? `(${wrappedName})` : ""
    )
    return RouteFC
  }
}
