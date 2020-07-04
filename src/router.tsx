import { ParamsValidation } from "./validations";
import { ExtractOnlyParams, FRouteComponentProps } from "./types";
import React from "react";
import { compile } from "path-to-regexp";
import { Route as ReactRoute, RouteProps } from "react-router";

Route.params = new ParamsValidation();

export function Route<Props>(
  WrappedComponent: React.FC<
    Props &
      FRouteComponentProps<{}> & {
        link: () => string;
      }
  >
): React.FC<Props & RouteProps>
export function Route<P extends string>(
  path: P
): <Props>(
  WrappedComponent: React.FC<
    Props &
      FRouteComponentProps<{}> & {
        link: () => string;
      }
  >
) => React.FC<Props & RouteProps> & {
  link: () => string;
};
export function Route<
  V extends {
    [x: string]: ParamsValidation<any>;
  },
  P extends (values: ExtractOnlyParams<V>) => string
>(
  validation: V,
  path: P
): <Props>(
  WrappedComponent: React.FC<
    Props &
      FRouteComponentProps<ExtractOnlyParams<V>> & {
        link: (params: ExtractOnlyParams<V>) => string;
      }
  >
) => React.FC<Props & RouteProps> & {
  link: (params: ExtractOnlyParams<V>) => string;
};
export function Route<V = any, P = any>(validation?: V, path?: P): any {
  if (typeof validation === 'function') {
    const WrappedComponent = validation;

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
      };

      return (
        <ReactRoute
          {...routeProps}
          render={(routeProps) => (
            <WrappedComponent {...props} {...routeProps} />
          )}
        />
      );
    };

    RouteFC.displayName = "FeatureRoute";
    return RouteFC
  }
  return function (WrappedComponent: any): any {
    let routePath: string | undefined;

    /**
     * When user provide route params and path factory
     */
    if (typeof validation === "object") {
      const paramsPath = Object.entries(validation).reduce<
        ExtractOnlyParams<V>
      >(
        (acc, [key, item]) => ({
          ...acc,
          [key]: item.generateRules(key),
        }),
        {} as ExtractOnlyParams<V>
      );
      if (typeof path === "function") {
        routePath = path(paramsPath);
      } else {
        throw new Error(
          `You haven't provided path function as a second argument`
        );
      }
    }
    /**
     * When user provide only route path
     */
    if (typeof validation === "string") {
      routePath = validation;
    }

    /**
     * Generated Route with route props & own props
     */
    const RouteFC: React.FC<any> & {
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
        path: routePath
      };

      return (
        <ReactRoute
          {...routeProps}
          render={(routeProps) => (
            <WrappedComponent {...props} {...routeProps} />
          )}
        />
      );
    };

    if (routePath) {
      const toPath = compile(routePath, { encode: encodeURIComponent });
      RouteFC.link = toPath;
    }
    RouteFC.defaultProps = {
      path: routePath,
    };
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name
    RouteFC.displayName = 'RouteHoc'.concat(wrappedName ? `(${wrappedName})`: '')
    return RouteFC;
  };
}
