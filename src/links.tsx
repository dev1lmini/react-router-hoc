import type { GetLink, RouteWithLink } from "./types"
import { compile } from "path-to-regexp"

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

export function generateLink<Path extends string>(
  path?: Path,
  params?: any,
  query?: any
) {
  const pathFatctoryOrPath =
    path && params && Object.keys(params).length
      ? compile(path, { encode: encodeURIComponent })
      : path

  if (query && Object.keys(query).length) {
    return (linkParams?: { [x: string]: any }) => {
      const { pathParams, queryParams } = linkParams ? Object.entries(linkParams).reduce(
        (acc, [key, value]) => {
          if (params[key]) {
            return {
              ...acc,
              pathParams: {
                ...acc.pathParams,
                [key]: value
              }
            }
          }
          if (query[key]) {
            return {
              ...acc,
              queryParams: {
                ...acc.queryParams,
                [key]: value
              }
            }
          }
          return acc
        },
        { pathParams: {}, queryParams: {} }
      ): {pathParams: {}, queryParams: {}}
      const pathname =
        typeof pathFatctoryOrPath === "function"
          ? pathFatctoryOrPath(pathParams)
          : pathFatctoryOrPath
      const search = new URLSearchParams(queryParams).toString()
      return `${pathname}?${search}`
    }
  }
  return pathFatctoryOrPath
}
