import React from "react"
import { Route } from "react-router-hoc"

const SearchRoute = Route(
  {
    city: Route.params.string,
    region: Route.params.string.optional,
    page: Route.query.number,
    street: Route.query.string
  },
  ({ city, region }) => `/search/${city}/${region}`
)

export default SearchRoute(
  ({
    match: {
      params,
      params: { city, region },
      query,
      query: { page = 1, street }
    },
    link,
    history: { push }
  }) => (
    <div>
      Search in {city} {region}
      <br />
      <input
        onBlur={event =>
          push(link({ ...query, ...params, street: event.target.value }))
        }
      />
      <br />
      {street && `Street: ${street}`}
      <br />
      Page: {page}
    </div>
  )
)
