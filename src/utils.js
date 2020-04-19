// console.warn(
  //   Object.values(validation).filter(
  //     (value) => value instanceof ParamsValidation
  //   )
  // );
  // const params = Object.entries(validation)
  //   .filter(([, value]) => value instanceof ParamsValidation)
  //   .reduce(
  //     (res, [key, value]) => ({
  //       ...res,
  //       [key]: value
  //     }),
  //     {}
  //   );
  // const schema = Joi.object().keys(params);
// }

// const p = new ParamsValidation();


// const SettingsRoute = Route(
//   {
//     city: p.string.required,
//     subarea: p.enum('foo').enum('bar'),
//   },
//   ({ city, subarea }) => `search/${region}/${city}/${subarea}`
// );

// // const Seerch = Route(
// //   {
// //     type: p.enum("foo", "customer"),
// //     id: p.number.string,
// //     venue: q.number
// //   },
// //   ({ type, id }) => `/search/${type}/${id}`
// // )<Props>(({ match: { params: { type, id } } }) => {
// //   return <div />;
// // });

// const Settings = SettingsRoute<Props>(({ match, link }) => {
//   link({ region: "amsterdam", city: "", subarea: "" });
//   params.region = "amsterdam";
//   return <div />;
// });

// // type GetLinkType<T extends { [x: string]: React.FC<{ [x: string]: any }> }> = {
// //   [K in keyof T]: T[K] extends React.FC<infer P>
// //     ? P extends { [x: string]: any }
// //       ? P["link"]
// //       : P
// //     : any
// // };

// // function getLink<T extends { [x: string]: React.FC<{ [x: string]: any }> }>(
// //   components: T
// // ) {
// //   return ("" as unknown) as GetLinkType<T>;
// // }

// // const links = getLink({ Settings, Seerch });
// // links.Seerch({ type: "customer", id: 5 });


// class QueryValidation<T = never> {
//   query: "query" = "query";
//   private schema;

//   enum<A extends Array<number | string>>(...a: A) {
//     this.schema = Joi.valid(a);
//     return this as QueryValidation<T | ExtractArray<A>>;
//   }

//   get string() {
//     this.schema = this.schema
//       ? Joi.alternatives(Joi.string(), this.schema)
//       : Joi.string();
//     return this as QueryValidation<T | string>;
//   }

//   get number() {
//     this.schema = this.schema
//       ? Joi.alternatives(Joi.number(), this.schema)
//       : Joi.number();
//     return this as QueryValidation<T | number>;
//   }

//   get required() {
//     this.schema = this.schema ? this.schema.required() : Joi.required();
//     return this as QueryValidation<T>;
//   }
//   validate(value: T) {
//     return Joi.validate(value, this.schema);
//   }
// }
