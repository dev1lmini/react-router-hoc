
import type {
  StaticContext,
  RouteComponentProps,
  match as RouteMatch
} from "react-router"
import type { ParamsValidation, QueryParamsValidation } from "../validations"
import type * as H from "history"
import type { SubType, PickType } from "./extracts"

export type ParamsType<T> = {
  [K in keyof T]: T[K] extends ParamsValidation<infer P> ? P : never
}

export type QueryParamsType<T> = {
  [K in keyof T]: T[K] extends QueryParamsValidation<infer P> ? P : never
}

export type Params<T> = SubType<ParamsType<SubType<T, ParamsValidation>>, {}> &
  Partial<PickType<ParamsType<SubType<T, ParamsValidation>>, undefined>>

export type QueryParams<T> = SubType<QueryParamsType<SubType<T, QueryParamsValidation>>, {}> &
Partial<PickType<QueryParamsType<SubType<T, QueryParamsValidation>>, undefined>>

export type RouteLink<
  Path extends string | undefined,
  Params = {}
> = keyof Params extends never
  ? () => Path
  : keyof SubType<Params, {}> extends undefined
  ? (params?: Params) => Path
  : (params: Params) => Path

type Match<Params = {}> = Omit<RouteMatch<Params>, "params"> & {
  params: Params
}

type Location<S, Q> =  Omit<H.Location<S>, 'search'> & {
  search: keyof Q extends never ? H.Search : Q
};

export type RouteHOCProps<
  Path extends string | undefined = undefined,
  Params = {},
  QueryParams = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
> = Omit<RouteComponentProps<Params, C, S>, "match" | "location"> & {
  match: Match<Params>
  link: RouteLink<Path, Params>
  location: Location<S, QueryParams>
}
