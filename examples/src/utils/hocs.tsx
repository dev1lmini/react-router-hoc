import React from "react";
import { Redirect } from "react-router";
type GetProps<T> = T extends React.ComponentType<infer P> ? P : any;

export function ProtectedRoute<T extends React.FC>(params: {
  access: boolean;
}): (WrappedComponent: T) => T;
export function ProtectedRoute<T extends React.FC>(
  WrappedComponent: T
): React.FC<GetProps<T> & { access: boolean }>;
export function ProtectedRoute<T extends any>(
  ComponentOrParams: T | { access: boolean }
): any {
  if ("access" in ComponentOrParams) {
    return (WrappedComponent: T) => {
      const Component: React.FC<GetProps<T>> = ({ ...rest }) =>
        WrappedComponent && ComponentOrParams.access ? (
          <WrappedComponent {...rest} />
        ) : (
          <Redirect to="/" />
        );
      return Component;
    };
  }

  const Component: React.FC<GetProps<T>> = ({ access, ...rest }) =>
    access ? <ComponentOrParams {...rest} /> : <Redirect to="/" />;
  return Component;
}
