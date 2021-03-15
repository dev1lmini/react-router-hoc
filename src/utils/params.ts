import { Params, QueryParams } from "../types"
import { ParamsValidation, QueryParamsValidation } from "../validations"

export const getParams = <Rules = {}>(configuration?: Rules): Params<Rules> | undefined => {
  if (!configuration) return undefined
  return Object.entries(configuration).reduce<Params<Rules>>(
    (acc, [key, item]) => {
      if (item instanceof ParamsValidation) {
        return {
          ...acc,
          [key]: item.generateRules(key)
        }
      }
      return acc
    },
    {} as Params<Rules>
  )
}

export const getQueryParams = <Rules = {}>(configuration?: Rules): QueryParams<Rules> | undefined => {
  if (!configuration) return undefined
  return Object.entries(configuration).reduce<QueryParams<Rules>>(
    (acc, [key, item]) => {
      if (item instanceof QueryParamsValidation) {
        return {
          ...acc,
          [key]: item
        }
      }
      return acc
    },
    {} as QueryParams<Rules>
  )
}
