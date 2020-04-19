import React from "react";
import { Route } from "react-router-hoc";

const ArticleRoute = Route(
  {
    id: Route.params.number,
  },
  ({ id }) => `/article/${id}`
);

export default ArticleRoute(({ match: { params: { id } } }) => (
  <div>This is article with ID: {id}</div>
));
