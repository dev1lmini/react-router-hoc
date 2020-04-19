import React from "react";
import { Route } from "react-router-hoc";

const SearchRoute = Route(
  {
    city: Route.params.string,
    region: Route.params.string.optional,
  },
  ({ city, region }) => `/search/${city}/${region}`
);

export default SearchRoute(({ match: { params: { city, region } } }) => (
  <div>
    Search in {city} {region}
  </div>
));
