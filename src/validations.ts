import type { ExtractArray } from "./types";

enum RulesEnum {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  REGEX = "regex",
  OPTIONAL = "optional",
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
    ) => string;
  } & {
    init: (rule: string) => string;
  } = {
    init: (rule) => `:${rule}`,
    string: (rule) => rule.toString(),
    number: (rule) => `${rule}(\\d+)`,
    enum: (rule, path) =>
      `${Array.isArray(rule) ? `:${path}(${rule.join("|")})` : rule}`,
    regex: (rule, path) => `:${path}(${rule.toString().slice(1, -1)})`,
    optional: (rule) => `${rule}?`,
  };

  constructor(
    private _rules?: {
      [P in RulesEnum]: boolean | Array<number | string> | RegExp;
    }
  ) {
    this._rules = this._rules ?? {
      string: false,
      number: false,
      enum: [],
      regex: false,
      optional: false,
    };
  }

  generateRules = (paramKey: string) => {
    return (
      this._rules &&
      Object.entries(this._rules).reduce((acc: string, [key, item]) => {
        switch (true) {
          case !!(Array.isArray(item) && item.length):
            return this.regexes[key as RulesEnum](item as any, paramKey);
          case item instanceof RegExp:
            return this.regexes[key as RulesEnum](item as any, paramKey);
          case item:
            return this.regexes[key as RulesEnum](acc);
          default:
            return acc;
        }
      }, this.regexes.init(paramKey))
    );
  };

  enum<Keys extends Array<number | string>>(...keys: Keys) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | ExtractArray<Keys>>({
      ...this._rules,
      enum: keys,
    });
  }

  get string() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | string>({ ...this._rules, string: true });
  }

  regex(reg: RegExp) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | string>({ ...this._rules, regex: reg });
  }

  get number() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | number>({ ...this._rules, number: true });
  }

  get optional() {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | undefined>({
      ...this._rules,
      optional: true,
    });
  }
}

export class QueryParamsValidation<T = never> {
  constructor(
    private _rules?: {
      [P in QueryParamsType]: boolean | Array<number | string> | RegExp;
    }
  ) {
    this._rules = this._rules ?? {
      string: false,
      array: false,
      number: false,
      boolean: false,
      enum: [],
      regex: false,
      required: false,
    };
  }

  required<K extends T>(_defaultParam: K): QueryParamsValidation<NonNullable<T>> {
    return this
  }

  array<K extends QueryParamsValidation>(type: K): QueryParamsValidation<T | Array<K extends QueryParamsValidation<infer V> ? V : any> | undefined> {
    return this
  }

  get number(): QueryParamsValidation<T | number | undefined> {
    return this
  }

  get string(): QueryParamsValidation<T | string | undefined> {
    return this
  }

  get boolean(): QueryParamsValidation<T | boolean | undefined> {
    return this
  }

  get regex(): QueryParamsValidation<T | string | undefined> {
    return this
  }

  enum<Keys extends Array<number | string>>(...keys: Keys): QueryParamsValidation<T | ExtractArray<Keys> | undefined> {
    return this
  }
}

