import React from "react";
import type { ExtractArray, UnionToIntersection, GetPropsFromArray, GetOutcomePropsFromArray, GetOutcomePropertiesFromArray } from "./types";

const omit = <T, K extends Array<keyof T>>(object: T, keys: K) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => keys.includes(key as keyof T))
  ) as Omit<T, ExtractArray<K>>;
};


export function compose<A extends ((...args: any[]) => any)[]>(...wrappers: A) {
  return function <P = {}>(
    WrappedComponent: React.FC<
      UnionToIntersection<ExtractArray<GetPropsFromArray<A>>> & P
    >
  ) {
    return (wrappers.reduce((component: typeof WrappedComponent, wrapper) => {
      const wrapped: typeof WrappedComponent = wrapper(component);
      Object.assign(wrapped, {
        ...omit(component, Object.keys(wrapped) as any),
        displayName: `${component.displayName || component.name}(${
          wrapped.displayName || wrapped.name
        })`,
        defaultProps: { ...component.defaultProps, ...wrapped.defaultProps },
      });
      return wrapped;
    }, WrappedComponent) as unknown) as React.FC<
      UnionToIntersection<ExtractArray<GetOutcomePropsFromArray<A>>> & P
    > & Omit<UnionToIntersection<ExtractArray<GetOutcomePropertiesFromArray<A>>>, keyof UnionToIntersection<ExtractArray<GetOutcomePropsFromArray<A>>>>;
  };
}
