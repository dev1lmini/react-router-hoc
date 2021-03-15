import React, { FC, FunctionComponent } from "react"
import { Route as ReactRoute, RouteComponentProps } from "react-router"
import type { RouteProps } from "react-router"
import {
  ParamsValidation,
  QueryParamsValidation,
  match as queryMatch
} from "../validations"
import type { RouteLink, QueryParams } from "../types"
import { getQueryParams } from "../utils"

export const isFunction = (value: any): value is (...args: any[]) => any =>
  typeof value === "function"

export const isComponent = (value: any): value is FunctionComponent =>
  value.isReactComponent === true

export function wrappedComponentFactory<Props extends RouteComponentProps>(
  WrappedComponent: FC<Props>
): FC<Props & { queryValidation?: QueryParams<any>; link: RouteLink<string> }> {
  return ({ match, queryValidation, ...props }) => {
    const query = queryMatch(props.location.search, queryValidation)
    const newMatch = {
      ...match,
      query
    }
    return <WrappedComponent {...(props as any)} match={newMatch} />
  }
}

export function routeComponentFactory<
  Props extends RouteComponentProps,
  Validation extends {
    [x: string]: ParamsValidation<any> | QueryParamsValidation<any>
  }
>(
  wrappedComponent: FC<Props>,
  link: (...args: any[]) => string | undefined ,
  validation?: Validation
): FC<RouteProps> & { link?: (...args: any[]) => string | undefined } {
  const WrappedComponent = wrappedComponentFactory(wrappedComponent)
  const queryParams = getQueryParams(validation)
  return ({
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
        render={routeCompponentProps => (
          <WrappedComponent
            {...(props as any)}
            {...routeCompponentProps}
            link={link}
            queryValidation={queryParams}
          />
        )}
      />
    )
  }
}
