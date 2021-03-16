
export type RouteWithLink = {
  [x: string]: any
  link: (...args: any[]) => string | undefined;
}

export type GetLink<T> = T extends RouteWithLink ? T['link'] : string
