
export type RouteWithLink = {
  [x: string]: any
  link: (params: any) => string;
}

export type GetLink<T> = T extends RouteWithLink ? T['link'] : string
