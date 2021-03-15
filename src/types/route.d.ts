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

export type QueryParams<T> = SubType<
  QueryParamsType<SubType<T, QueryParamsValidation<any>>>,
  {}
> &
  Partial<
    PickType<QueryParamsType<SubType<T, QueryParamsValidation<any>>>, undefined>
  >


export type RoutePath<Params = undefined> = keyof Params extends never
  ? string
  : (params: Params) => string

export type GetPath<Path> = Path extends (...args: any) => any
  ? ReturnType<Path>
  : Path

export type RouteLink<
  Path extends string | undefined,
  Params = {},
  QueryParams = {}
> = keyof (Params & QueryParams) extends never
  ? Path
  : keyof SubType<Params, {}> extends undefined
  ? (params?: Params & Partial<QueryParams>) => Path
  : (params: Params & Partial<QueryParams>) => Path

type Match<Params = {}, QueryParams = {}> = Omit<
  RouteMatch<Params>,
  "params"
> & {
  params: Params
  query: QueryParams
}

export type RouteHOCProps<
  Path extends string | undefined = undefined,
  Params = {},
  QueryParams = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
> = Omit<RouteComponentProps<Params, C, S>, "match"> & {
  match: Match<Params, QueryParams>
  link: RouteLink<Path, Params, QueryParams>
}
