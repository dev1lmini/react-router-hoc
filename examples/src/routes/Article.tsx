import React from "react"
import { Route, compose } from "react-router-hoc"
import { ProtectedRoute } from "../utils/hocs"

const ArticleRoute = compose(
  ProtectedRoute({ access: true }),
  Route(
    {
      id: Route.params.number,
      action: Route.params.oneOf("print", "edit").optional,
      publicToken: Route.query.regex(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/)
    },
    ({ id, action }) => `/article/${id}/${action}`
  )
)

export default ArticleRoute(({ match: { params: { id, action }, query: {publicToken} } }) => (
  <div>
    This is article with ID: {id}
    {action === "edit" && "Edit this article"}
    {action === "print" && "Print this article"}
    {!publicToken && 'No article provided'}
  </div>
))
