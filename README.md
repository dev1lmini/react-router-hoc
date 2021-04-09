# React Router Route Higher-Order Component
_Inspired by [type-route](https://github.com/type-route/type-route)_

_The binding for react-router that provides a new way of declaring react-router route with path params and query params validation and typescript support_

## Use cases

- ⚗️ Declare route inside a component
- ⛔️ Declare validation for route path and query params
- 🚀 Generate links for a route with necessary params
- 💻 Get suggestions in IDE

<p align="center" width="100%">
    <img width="100%" src="./capture.gif">
</p>

## Documentation

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](examples/src/routes)

## Installation

```npm i react-router-hoc react-router```

_The binding helps you to declare a react-router route in the component itself or in a container. Preferably this is created to define a route in the component which helps you to contain everything in one file._

## Usage

#### Route declaration with path and query params validation

```tsx
import { Route } from "react-router-hoc";

const DashboardRoute = Route(
  {
    role: Route.params.oneOf("customer", "employee"),
    region: Route.params.string,
    storage: Route.params.number.optional,
    page: Route.query.number,
    range: Route.query.oneOf('day', 'week'),
    gangs: Route.query.array(Route.query.oneOf('ballas', 'grove_street', 'lost_santos'))
  },
  ({ role, region, storage }) => `/dashboard/${role}/${region}/${storage}`
);

// Example props type
type Props = {
  user?: User;
};

export default DashboardRoute<Props>(
  ({
    user,
    match: {
      params: { role, region, storage },
       /* Set default query params if it does not match the validation rule */
      query: { page = 1, range = 'day', gangs = ['ballas']}
    },
  }) => {
    return; /** template */
  }
);
```

#### Use it as a regular route component in the router

```tsx
<Router>
  <Dashboard user={user} />
</Router>
```

```tsx
<Router>
  <Switch>
    <Home exact />
    <Dashboard user={user} />
    <NotFound />
  </Switch>
</Router>
```

### Links generation

#### Generate links object

```tsx
// App.tsx

import { getLinks } from 'react-router-hoc'

import Dashboard from 'Dashboard'
import Search from 'Search'
import Article from 'Article'
import Home from 'Home'

export const links = getLinks({
  Dashboard,
  Search,
  Article,
  Home
})


// Search.tsx
import { links } from 'App'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-hoc'

export default Route(`/search`)(() => (
  <section>
    <Link
      /* Provide all path and query params as a single object argument */
      to={links.Dashboard({
        role: "customer",
        region: "Staryi Sambir",
        range: "week",
        page: 3
      })}
    />
  </section>
))
```

#### Generate link to the route

```tsx
import Dashboard from 'Dashboard'

<Router>
  <Link to={Dashboard.link({ role: 'customer', region: 'Staryi Sambir'})}>
</Router>
```

#### Get link to the same component
*If you want to change params and query params for the same route, you can use the link function from props to generate the necessary link*

```tsx
import { Route } from "react-router-hoc"

export default Route(
  { city: Route.query.string },
  "/search"
)(({ link }) => {
  return (
    <section>
      <input onBlur={event => link({ city: event.target.value })} />
      {city}
    </section>
  )
})

```

### HOCs composition

### Use `compose` to combine any HOCs with Route HOC

```tsx
import { ProtectedRoute } from './your-awesome-protected-route-hoc'
import { Route, compose } from 'react-router-hoc'

const SearchRoute = compose(
  ProtectedRoute,
  Route({
    city: Route.params.string,
    page: Route.query.number
  }, ({ city}) => `/search/${city}`)
)

export default SearchRoute(() => /* template /*)
```

#### Route declaration with only path params

```tsx
import { Route } from "react-router-hoc"

const SearchRoute = Route(
  { city: Route.params.string.optional },
  ({ city }) => `/search/${city}`
)

export default SearchRoute(
  ({
    match: {
      params: { city }
    }
  }) => {
    return /** template */
  }
)
```

#### Route declaration with only query params

```tsx
import { Route } from "react-router-hoc"

const SearchRoute = Route(
  { age: Route.query.number },
  `/search`
)

export default SearchRoute(
  ({
    match: {
      /* Set default query param if necessary */
      query: { age = 18 }
    }
  }) => {
    return /** template */
  }
)
```

#### Route declaration without params

```tsx
import { Route } from "react-router-hoc";

const HomeRoute = Route(`/home`);

export default HomeRoute(() => {
  return; /** template */
});
```

#### Curring route declaration

```tsx
import { Route } from 'react-router-hoc'

export default Route(`/home`)(() =>  /** template */)
```

#### Empty route declaration (for compatibility with react-router)

```tsx
import { Route } from 'react-router-hoc'

export default Route(() => /** template */)
```

[See more examples in the repo](examples)

## API

### Validation rules

_Route HOC provides a way to declare validation rules for path and query params, once you apply the rule it will influence route matching._


**Path params**
```tsx
  role: Route.params.oneOf("customer", "employee"),
  region: Route.params.string,
  storage: Route.params.number,
  hash: Route.params.regex(/[0-9a-fA-f]{40}/),
  optional: Route.params.string.optional
```

**Query params**
```tsx
  role: Route.query.oneOf("customer", "employee"),
  region: Route.query.string,
  storage: Route.query.number,
  hash: Route.query.regex(/[0-9a-fA-f]{40}/),
```

| Rule                                   | Match                                         | Example                                                                                                                                                                                                                                  |
| :------------------------------------- | :-------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Route.params.**string**`              | _Match any value_                             | `/:any` (`/228` -> `'228'` will be converted to a string)                                                                                                                                                                                |
| `Route.params.number`                  | _Match only numbers_                          | `/:number` (`'3078'` -> `3078` will be converted to a number, `/foo` won't match the route)                                                                                                                                              |
| `Route.params.oneOf`                   | _Match one of variants_                       | `/customer` or `/employee`                                                                                                                                                                                                               |
| `Route.params.regex`                   | _Match a regex_                               | `regex(/[0-9a-fA-f]{40}/)` (`ca82a6dff817ec66f44342007202690a93763949` match commit hash)                                                                                                                                                |
| `Route.params.optional`                | _Make a rule optional_                        | `/any` or `/`                                                                                                                                                                                                                            |
| `Route.query.string`                   | _Match any value_                             | `?param=anyValue`  (Any value is propagated as a string)                                                                                                                                                                                 |
| `Route.query.number`                   | _Match only numbers_                          | `/params=6` (`'3078'` -> `3078` will be converted to a number, if no number is provided, the value will be `undefined`)                                                                                                                  |
| `Route.query.oneOf`                    | _Match one of variants_                       | `?param=customer` or `?param=employee`, if no one of these value is provided, the value will be `undefined`                                                                                                                              |
| `Route.query.regex`                    | _Match a regex_                               | `regex(/[0-9a-fA-f]{40}/)` (`?hash=ca82a6dff817ec66f44342007202690a93763949` match commit hash, if the provided value doesn't match the pattern, `undefined` will be set to the query param)                                             |
| `Route.query.array(Route.query[rule])` | _Match array of values validate by the route_ | `?gang=ballas&gang=mafia`, will match an array of values that are validated by the other rules, if no array is provided it will be `undefined`, if an array doesn't contain a value that matches validation, it won't appear in an array |

