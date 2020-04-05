import { ParamsValidation } from "./validations";
import {
  ExtractOnlyParams,
  FRouteComponentProps,
} from "./types";
import React from "react";
import { compile } from "path-to-regexp";
import { Route as ReactRoute, RouteProps } from "react-router";

export function Route<
  V extends {
    [x: string]: ParamsValidation<any>;
  },
  P extends (values: ExtractOnlyParams<V>) => string
>(validation: V, path: P) {
  return function <Props>(
    WrappedComponent: React.FC<
      Props &
        FRouteComponentProps<ExtractOnlyParams<V>> & {
          link: (params: ExtractOnlyParams<V>) => string;
        }
    >
  ): React.FC<Props & RouteProps> & {
    link: (params: ExtractOnlyParams<V>) => string;
  } {
    const paramsPath = Object.entries(validation).reduce<ExtractOnlyParams<V>>(
      (acc, [key, item]) => ({
        ...acc,
        [key]: item.generateRules(key),
      }),
      {} as ExtractOnlyParams<V>
    );

    const routePath = path(paramsPath);

    const RouteFC: React.FC<Props & RouteProps> & {
      link: (params: ExtractOnlyParams<V>) => string;
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
      };

      return (
        <ReactRoute
          {...routeProps}
          path={routePath}
          render={(routeProps) => (
            <WrappedComponent {...(props as any)} {...routeProps} />
          )}
        />
      );
    };
    const toPath = compile(routePath, { encode: encodeURIComponent });
    RouteFC.link = toPath;
    RouteFC.defaultProps = {
      path: routePath as any,
    };
    RouteFC.displayName = "FeatureRoute";
    return RouteFC;
  };
}
