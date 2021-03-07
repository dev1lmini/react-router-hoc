import type { GetLink, RouteWithLink } from "./types";

export function getLinks<T extends {[x: string]: RouteWithLink}>(links: T): {[P in keyof T]: GetLink<T[P]>} {
  return Object.entries(links).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.link
  }),{}) as {[P in keyof T]: GetLink<T[P]>}
}
