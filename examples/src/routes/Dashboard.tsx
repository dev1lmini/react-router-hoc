import React from "react";
import { Route, compose } from "react-router-hoc";
import { ProtectedRoute } from "../utils/hocs";

const DashboardRoute = compose(
  ProtectedRoute,
  Route(
    {
      role: Route.params.oneOf("customer", "vendor"),
    },
    ({ role }) => `/dashboard/${role}`
  )
);
export default DashboardRoute(({ match: { params: { role } } }) => (
  <div>Dashboard for {role}</div>
));
