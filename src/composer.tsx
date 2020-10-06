import React from "react";

const omit = <T, K extends Array<keyof T>>(object: T, keys: K) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => keys.includes(key as keyof T))
  ) as Omit<T, ExtractArray<K>>;
};
type GetProps<T> = T extends React.ComponentType<infer P> ? P : any;
type ReturnTypeNoConstraints<T> = T extends (...args: any) => infer R ? R : any;
type Arguments<T> = T extends (args: infer P) => any ? P : any;
type ExtractArray<T> = T extends Array<infer P> ? P : any;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type GetPropsFromArray<T extends [...any[]]> = {
  [I in keyof T]: GetProps<Arguments<T[I]>>;
};

type GetOutcomePropsFromArray<T extends Array<(...args: any) => any>> = {
  [I in keyof T]: GetProps<ReturnTypeNoConstraints<T[I]>>;
};
type GetOutcomePropertiesFromArray<T extends Array<(...args: any) => any>> = {
  [I in keyof T]: ReturnTypeNoConstraints<T[I]>;
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
