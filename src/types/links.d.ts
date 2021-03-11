
export type RouteWithLink = {
  [x: string]: any
  link: ((params: any) => string) | string;
}

export type GetLink<T> = T extends RouteWithLink ? T['link'] : string
