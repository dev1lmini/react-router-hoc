import { ExtractArray } from "./types";

enum RulesEnum {
  STRING = "string",
  NUMBER = "number",
  ENUM = "enum",
  REGEX = "regex",
  OPTIONAL = "optional",
}

export class ParamsValidation<T = never> {
  param: "params" = "params";
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

  enum<A extends Array<number | string>>(...a: A) {
    if (!this._rules) {
      throw Error(`Validation hasn't been initialized`);
    }
    return new ParamsValidation<T | ExtractArray<A>>({
      ...this._rules,
      enum: a,
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

export default new ParamsValidation();

