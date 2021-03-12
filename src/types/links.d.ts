
export type RouteWithLink = {
  [x: string]: any
  link: ((params: any) => string) | string | undefined;
}

export type GetLink<T> = T extends RouteWithLink ? NonNullable<T['link']> : string
