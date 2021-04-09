import React from "react"
import { Route } from "react-router-hoc"

export default Route(
  {
    exapnded: Route.query.boolean
  },
  "/overview"
)(({ match: { query: { exapnded } } }) => (
  <div>This is overview page {exapnded && "More data"}</div>
))
