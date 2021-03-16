import { compile } from "path-to-regexp"
import type { GetLink, RouteWithLink, RouteLink } from "./types"
import { ParamsValidation, QueryParamsValidation } from "validations"

export function getLinks<T extends { [x: string]: RouteWithLink }>(
  links: T
): { [P in keyof T]: GetLink<T[P]> } {
  return Object.entries(links).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.link
    }),
    {}
  ) as { [P in keyof T]: GetLink<T[P]> }
}

export function generateLink<
  Path extends string,
  Params extends { [x: string]: ParamsValidation<any> } = {},
  Query extends { [x: string]: QueryParamsValidation<any> } = {}
>(path?: Path, params?: Params, query?: Query): RouteLink<Path, Params, Query> {
  if (!path) {
    return (() => path) as RouteLink<Path, Params, Query>
  }

  const pathFatctory = compile(path, { encode: encodeURIComponent })

  return ((linkParams?: {[x: string]: Params | Query}) => {
    const { pathParams = {}, queryParams = {} } = linkParams
      ? Object.entries(linkParams).reduce(
          (acc, [key, value]) => {
            const pathParams = {
              ...acc.pathParams,
              ...(params?.[key as keyof typeof params] ? { [key]: value } : {})
            }
            const queryParams = {
              ...acc.queryParams,
              ...(query?.[key as keyof typeof query] ? { [key]: value } : {})
            }
            return {
              ...acc,
              pathParams,
              queryParams
            }
          },
          { pathParams: {}, queryParams: {} }
        )
      : {}

      const search = Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => acc.append(key, item))
          return acc
        }
        acc.set(key, String(value))
        return acc
      }, new URLSearchParams())

    const pathname = pathFatctory(pathParams)
    if (search) {
      return `${pathname}?${search}`
    }
    return pathname
  }) as RouteLink<Path, Params, Query>
}
