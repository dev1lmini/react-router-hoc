import type { ExtractArray, QueryParams } from "../types"

enum QueryParamsType {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  BOOLEAN = "boolean",
  ARRAY = "array",
  REGEX = "regex",
}

export const match = <T>(search: string, rules?: QueryParams<T>): T => {
  if (!rules || !Object.keys(rules).length) return {} as T

  const searchParams = new URLSearchParams(search)

  return Object.entries<QueryParamsValidation>(rules).reduce((acc, [key, item]) => {
    return {
      ...acc,
      [key]: item.validate(searchParams.getAll(key))
    }
  }, {} as T)

}

export class QueryParamsValidation<T = never> {

  private initialRules = {
    string: false,
    number: false,
    boolean: false,
    enum: [],
    array: false,
    regex: false,
  }

  private validators = {
    string: (value: any) => {
      if (typeof value === "string") {
        return value
      }
    },
    number: (value: any) => {
      const number = Number(value)
      if (!Number.isNaN(number) && value !== null) {
        return number
      }
    },
    boolean: (value: any) => {
      if (value) {
        try {
          const bool = JSON.parse(value)
          if (typeof bool === "boolean") return bool
        } catch {
          return
        }
      }
    },
    enum: (value: any, values: any) => {
      if (Array.isArray(values)) {
        return values.find(item => item == value)
      }
    },
    array: (value: any, type: any) => {
      if (
        Array.isArray(value) &&
        value.length &&
        type instanceof QueryParamsValidation
      ) {
        return value.map(item => type.validate([item]))
      }
    },
    regex: (value: any, rule: any) => {
      if (rule instanceof RegExp && rule.test(value)) {
        return value
      }
    },
  }

  constructor(
    private _rules?: {
      [P in QueryParamsType]?:
        | boolean
        | Array<number | string>
        | RegExp
        | QueryParamsValidation<any>
    }
  ) {
    this._rules = this._rules ?? this.initialRules
  }

  validate(value: any[]): T {
    const rules =
      this._rules &&
      ((Object.entries(this._rules).filter(([_key, item]) =>
        Array.isArray(item) ? item.length : item
      ) as unknown) as
        | [QueryParamsType, boolean | Array<number | string> | RegExp][]
        | undefined)

    return rules?.reduce<T | undefined>(
      (acc, [key, item], index, array) => {
        const validator = this.validators[key]

        const value =
          key !== QueryParamsType.ARRAY &&
          array[index - 1]?.[0] !== QueryParamsType.ARRAY &&
          Array.isArray(acc)
            ? acc[acc.length - 1]
            : acc

        const queryParam = validator(value, item)

        if (index === array.length - 1) {
          return queryParam
        }
        return queryParam
      },
      (value as unknown) as T
    ) as T
  }

  array<K extends QueryParamsValidation<any>>(type: K) {
    return new QueryParamsValidation<
      T | Array<K extends QueryParamsValidation<infer V> ? V : any> | undefined
    >({
      array: type,
    })
  }

  get number() {
    return new QueryParamsValidation<T | number | undefined>({
      number: true,
    })
  }

  get string() {
    return new QueryParamsValidation<T | string | undefined>({
      string: true,
    })
  }

  get boolean() {
    return new QueryParamsValidation<T | boolean | undefined>({
      boolean: true,
    })
  }

  regex(rule: RegExp) {
    return new QueryParamsValidation<T | string | undefined>({
      regex: rule,
    })
  }

  enum<Keys extends Array<number | string>>(...keys: Keys) {
    return new QueryParamsValidation<T | ExtractArray<Keys> | undefined>({
      enum: keys,
    })
  }
}
