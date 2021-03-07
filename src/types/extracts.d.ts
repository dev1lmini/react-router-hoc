import { ComponentType } from "react"

export type ExtractArray<T> = T extends Array<infer G> ? G : never

export type GetProps<T> = T extends ComponentType<infer P> ? P : any


export type SubType<Type, Pattern> = Pick<
  Type,
  { [Key in keyof Type]: Type[Key] extends Pattern ? Key : never }[keyof Type]
>

export type PickType<Type, Pattern> = Pick<
  Type,
  { [Key in keyof Type]: Pattern extends Type[Key] ? Key : never }[keyof Type]
>

export type ReturnTypeNoConstraints<T> = T extends (...args: any) => infer R ? R : any;
export type Arguments<T> = T extends (args: infer P) => any ? P : any;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type GetPropsFromArray<T extends [...any[]]> = {
  [I in keyof T]: GetProps<Arguments<T[I]>>;
};

export type GetOutcomePropsFromArray<T extends Array<(...args: any) => any>> = {
  [I in keyof T]: GetProps<ReturnTypeNoConstraints<T[I]>>;
};
export type GetOutcomePropertiesFromArray<T extends Array<(...args: any) => any>> = {
  [I in keyof T]: ReturnTypeNoConstraints<T[I]>;
};
