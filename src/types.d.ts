import { ParamsValidation } from "./validations";
import { StaticContext } from "react-router";
import * as H from "history";
import { ComponentType } from "react";
export type ExtractArray<T> = T extends Array<infer G> ? G : never;

export type GetProps<T> = T extends ComponentType<infer P> ? P : any

export type ExtractParams<T> = {
  [P in keyof T]: T[P] extends ParamsValidation<infer L> ? L : string;
};

export type SubType<Base, Condition> = Pick<
  Base,
  { [Key in keyof Base]: Base[Key] extends Condition ? never : Key }[keyof Base]
>;

export type ExtractOnlyParams<T> = UndefinedToPartial<SubType<
  { [P in keyof T]: T[P] extends ParamsValidation<infer K> ? K : never },
  never
>>;

export type UndefinedToPartial<T> = SubType<
  { [P in keyof T]: undefined extends T[P] ? never : T[P] },
  never
> &
  Partial<
    SubType<{ [P in keyof T]: undefined extends T[P] ? T[P] : never }, never>
  >;

interface match<Params = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface FRouteComponentProps<
  Params = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
> {
  history: H.History<S>;
  location: H.Location<S>;
  match: match<Params>;
  staticContext?: C;
}
