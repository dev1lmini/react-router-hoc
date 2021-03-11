import type { ExtractArray } from "./types"

enum RulesEnum {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  REGEX = "regex",
  OPTIONAL = "optional"
}

enum QueryParamsType {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  BOOLEAN = "boolean",
  ARRAY = "array",
  REGEX = "regex",
  REQUIRED = "required"
}
export class ParamsValidation<T = never> {
  private regexes: {
    [P in RulesEnum]: (
      rule: string | Array<number | string>,
      path?: string
    ) => string
  } & {
    init: (rule: string) => string
  } = {
    init: rule => `:${rule}`,
    string: rule => rule.toString(),
    number: rule => `${rule}(\\d+)`,
    enum: (rule, path) =>
      `${Array.isArray(rule) ? `:${path}(${rule.join("|")})` : rule}`,
    regex: (rule, path) => `:${path}(${rule.toString().slice(1, -1)})`,
    optional: rule => `${rule}?`
  }

  constructor(
    private _rules?: {
      [P in RulesEnum]: T | boolean | Array<number | string> | RegExp
    }
  ) {
    this._rules = this._rules ?? {
      string: false,
      number: false,
      enum: [],
      regex: false,
      optional: false
    }
  }

  generateRules = (paramKey: string) => {
    return (
      this._rules &&
      Object.entries(this._rules).reduce((acc: string, [key, item]) => {
        switch (true) {
          case !!(Array.isArray(item) && item.length):
            return this.regexes[key as RulesEnum](item as any, paramKey)
          case item instanceof RegExp:
            return this.regexes[key as RulesEnum](item as any, paramKey)
          case item:
            return this.regexes[key as RulesEnum](acc)
          default:
            return acc
        }
      }, this.regexes.init(paramKey))
    )
  }

  enum<Keys extends Array<number | string>>(...keys: Keys) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new ParamsValidation<T | ExtractArray<Keys>>({
      ...this._rules,
      enum: keys
    })
  }

  get string() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new ParamsValidation<T | string>({ ...this._rules, string: true })
  }

  regex(reg: RegExp) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new ParamsValidation<T | string>({ ...this._rules, regex: reg })
  }

  get number() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new ParamsValidation<T | number>({ ...this._rules, number: true })
  }

  get optional() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new ParamsValidation<T | undefined>({
      ...this._rules,
      optional: true
    })
  }
}

export class QueryParam<T> {
  constructor(private value: T, private required: boolean = false) {}

  get isRequired() {
    return this.required
  }

  valueOf(deep = false) {
    const value = (this.value as any)?.valueOf()
    if (deep && Array.isArray(value)) {
      return value.map(item => item?.valueOf())
    }
    return value
  }
}

export class QueryParamsValidation<T = never> {
  private initialRules = {
    string: false,
    number: false,
    boolean: false,
    enum: [],
    array: false,
    regex: false,
    required: false
  }
  private validators = {
    string: (value: any) => {
      if (typeof value === "string") {
        return new QueryParam(value)
      }
    },
    number: (value: any) => {
      const number = Number(value)
      if (!Number.isNaN(number) && value !== null) {
        return new QueryParam(number)
      }
    },
    boolean: (value: any) => {
      if (value) {
        try {
          const bool = JSON.parse(value)
          if (typeof bool === "boolean") return new QueryParam(bool)
        } catch {
          return
        }
      }
    },
    enum: (value: any, values: any) => {
      if (Array.isArray(values)) {
        return new QueryParam(values.find(item => item == value))
      }
    },
    array: (value: any, type: any) => {
      if (
        Array.isArray(value) &&
        value.length &&
        type instanceof QueryParamsValidation
      ) {
        return new QueryParam(value.map(item => type.validate([item])))
      }
    },
    regex: (value: any, rule: any) => {
      if (rule instanceof RegExp && rule.test(value)) {
        return new QueryParam(value)
      }
    },
    required: (value: any) => {
      if (value === undefined || value === null) {
        return new QueryParam(this._rules?.required, true)
      }
      return new QueryParam(value)
    }
  }
  constructor(
    private _rules?: {
      [P in QueryParamsType]:
        | boolean
        | Array<number | string>
        | RegExp
        | QueryParamsValidation<any>
    }
  ) {
    this._rules = this._rules ?? this.initialRules
  }

  validate(value: any[]): QueryParam<T> {
    const rules =
      this._rules &&
      ((Object.entries(this._rules).filter(([_key, item]) =>
        Array.isArray(item) ? item.length : item
      ) as unknown) as
        | [QueryParamsType, boolean | Array<number | string> | RegExp][]
        | undefined)

    return rules?.reduce<QueryParam<any> | undefined>(
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
        return queryParam?.valueOf()
      },
      (value as unknown) as QueryParam<any>
    ) as QueryParam<T>
  }

  required<K extends T>(defaultParam: NonNullable<K>) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<NonNullable<T>>({
      ...this._rules,
      required: defaultParam as any
    })
  }

  array<K extends QueryParamsValidation<any>>(type: K) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<
      T | Array<K extends QueryParamsValidation<infer V> ? V : any> | undefined
    >({
      ...this.initialRules,
      array: type,
      required: this._rules.required
    })
  }

  get number() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<T | number | undefined>({
      ...this.initialRules,
      number: true,
      required: this._rules.required
    })
  }

  get string() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<T | string | undefined>({
      ...this.initialRules,
      string: true,
      required: this._rules.required
    })
  }

  get boolean() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<T | boolean | undefined>({
      ...this.initialRules,
      boolean: true,
      required: this._rules.required
    })
  }

  regex(rule: RegExp) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<T | string | undefined>({
      ...this.initialRules,
      regex: rule,
      required: this._rules.required
    })
  }

  enum<Keys extends Array<number | string>>(...keys: Keys) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`)
    }
    return new QueryParamsValidation<T | ExtractArray<Keys> | undefined>({
      ...this.initialRules,
      enum: keys,
      required: this._rules.required
    })
  }
}
