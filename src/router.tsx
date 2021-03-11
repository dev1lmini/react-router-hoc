import React from "react"
import { Route as ReactRoute } from "react-router"
import type { RouteProps } from "react-router"
import { compile } from "path-to-regexp"
import {
  ParamsValidation,
  QueryParamsValidation,
  QueryParam
} from "./validations"
import type {
  RouteHOCProps,
  Params,
  RouteLink,
  QueryParams,
  RoutePath,
  GetPath
} from "./types"

Route.params = new ParamsValidation()
Route.query = new QueryParamsValidation()

const findRequired = (
  params: [string, QueryParam<any> | undefined][] | undefined
): [string, QueryParam<any> | undefined][] | undefined => {
  return params?.filter(([key, value]) => {
    return Array.isArray(value?.valueOf())
      ? value?.isRequired ||
          findRequired(
            value?.valueOf().map((item: any) => {
              console.log(item)
              return [key, item]
            })
          )?.length
      : value?.isRequired
  })
}

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
  link: RouteLink<GetPath<Path>, Params<Validation>>
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
        (acc, [key, item]) => {
          if (item instanceof ParamsValidation) {
            return {
              ...acc,
              [key]: item.generateRules(key)
            }
          }
          return acc
        },
        {} as Params<Validation>
      )
      if (Object.keys(paramsPath).length) {
        if (typeof path !== "function")
          throw new Error(
            `You haven't provided path function as a second argument`
          )
        routePath = path(paramsPath)
      } else {
        routePath = path && String(path)
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
          render={({ match, ...routeProps }) => {
            const searchParams = new URLSearchParams(routeProps.location.search)
            const queryParams =
              typeof validation === "object"
                ? Object.entries(validation).reduce<
                    [string, QueryParam<any> | undefined][]
                  >((acc, [key, item]) => {
                    if (item instanceof QueryParamsValidation) {
                      return acc.concat([
                        [key, item.validate(searchParams.getAll(key))]
                      ])
                    }
                    return acc
                  }, [])
                : []

            const requiredParams = findRequired(queryParams)

            const query = queryParams.reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value?.valueOf(true)
              }),
              {} as QueryParams<Validation>
            )

            if (requiredParams?.length) {
              requiredParams.forEach(([key, param]) =>
                searchParams.set(key, param?.valueOf(true))
              )
              routeProps.history.replace({ search: searchParams.toString() })
            }

            const newMatch = {
              ...match,
              query
            }
            return (
              <WrappedComponent
                link={toPath}
                {...props}
                {...routeProps}
                match={newMatch}
              />
            )
          }}
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