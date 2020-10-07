import React from "react";
import { Route, compose } from "react-router-hoc";
import { ProtectedRoute } from "../utils/hocs";

const ArticleRoute = compose(
  ProtectedRoute({ access: true }),
  Route(
    {
      id: Route.params.number,
    },
    ({ id }) => `/article/${id}`
  )
);

export default ArticleRoute(({ match: { params: { id } } }) => (
  <div>This is article with ID: {id}</div>
));
