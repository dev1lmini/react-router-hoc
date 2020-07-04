
type RouteWithLink = {
  [x: string]: any
  link: (params: any) => string;
}

type GetLink<T> = T extends {
  [x: string]: any,
  link: (params: infer V) => string,
} ? T['link'] : string

export function getLinks<T extends {[x: string]: RouteWithLink}>(links: T): {[P in keyof T]: GetLink<T[P]>} {

  return Object.entries(links).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.link
  }),{}) as any
}
