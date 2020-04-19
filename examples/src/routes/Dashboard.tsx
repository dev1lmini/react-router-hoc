import React from "react";
import { Route } from "react-router-hoc";

const DashboardRoute = Route(
  {
    role: Route.params.enum("customer", "vendor"),
  },
  ({ role }) => `/dashboard/${role}`
);

export default DashboardRoute(({ match: { params: { role } } }) => (
  <div>Dashboard for {role}</div>
));
