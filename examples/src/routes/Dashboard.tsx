import React from "react"
import { Route, compose } from "react-router-hoc"
import { ProtectedRoute } from "../utils/hocs"

const DashboardRoute = compose(
  ProtectedRoute,
  Route(
    {
      role: Route.params.oneOf("customer", "vendor"),
      region: Route.params.string,
      storage: Route.params.number.optional,
      page: Route.query.number,
      range: Route.query.oneOf("day", "week"),
      gangs: Route.query.array(
        Route.query.oneOf("ballas", "grove_street", "lost_santos")
      )
    },
    ({ role, region, storage }) => `/dashboard/${role}/${region}/${storage}`
  )
)
export default DashboardRoute(
  ({
    match: {
      params: { role, region, storage },
      query: { gangs, range = "day", page = 1 }
    }
  }) => (
    <div>
      Dashboard for
      <div>
        {role} | {region} | {storage}
      </div>
      <div>
        {gangs?.join("|")}<br/>
        Range: {range}<br/>
        Page: {page}<br/>
      </div>
    </div>
  )
)
