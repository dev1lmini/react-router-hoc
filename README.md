# React Router Route Higher-Order Component
_Inspired by [type-route](https://github.com/type-route/type-route)_

_The binding for react-router that provides a new way of declaring react-router route with params validation and typescript support_

![Image](https://i.ibb.co/hF7bn5d/out.gif)

## Use cases

- ⚗️ Declare route inside a component
- ⛔️ Declare validation for route params
- 🚀 Generate links for a route
- 💻 Get suggestions on IDE

## Documentation

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

## Installation

```npm i react-router-hoc react-router```

_The binding helps you to declare a react-router route in the component itself or in a container. Preferably this is created to define a route in the component which helps you to contain everything in one file._

## Usage

#### Route declaration with params validation

```tsx
import { Route } from "react-router-hoc";

const DashboardRoute = Route(
  {
    role: Route.params.enum("customer", "employee"),
    region: Route.params.string,
    storage: Route.params.number.optional,
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

export default Route(`search`)(() => <section>
  <Link to={links.Dashboard({ role: 'customer', region: 'Staryi Sambir'})}>
</section>)
```

#### Generate link to the route

```tsx
import Dashboard from 'Dashboard'

<Router>
  <Link to={Dashboard.link({ role: 'customer', region: 'Staryi Sambir'})}>
</Router>
```

### HOCs composition

### Use `compose` to combine any HOCs with Route HOC

```tsx
import { ProtectedRoute } from 'utils/hocs'
import { Route, compose } from 'react-router-hoc'

const SearchRoute = compose(
  ProtectedRoute,
  Route({
    city: Route.params.string
  }, ({ city}) => `/search/${city}`)
)

export default SearchRoute(() => /* template /*)
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

#### Empty route declaration

```tsx
import { Route } from 'react-router-hoc'

export default Route(() => /** template */)
```

[See more examples in the repo](examples)

## API

### Validation rules

_Route HOC provides a way to declare validation rules for route params, once you apply the rule it will influence route matching._

```tsx
  role: Route.params.enum("customer", "employee"),
  region: Route.params.string,
  storage: Route.params.number,
  hash: Route.params.regex(/[0-9a-fA-f]{40}/),
  optional: Route.params.string.optional
```

| Rule                    | Match                      | Example                                                                                   |
| :---------------------- | :------------------------- | :---------------------------------------------------------------------------------------- |
| `Route.params.string`   | _Match any value_          | `/:any` (`/228` -> `228` will be converted to a string)                                   |
| `Route.params.number`   | _Match only numbers_       | `/:number` (`3078` -> `3078` will be converted to a number, `/foo` won't match the route) |
| `Route.params.enum`     | _Match one of variants_    | `/customer` or `/employee`                                                                |
| `Route.params.regex`    | _Match commit hash number_ | `regex(/[0-9a-fA-f]{40}/)` (`ca82a6dff817ec66f44342007202690a93763949` match commit hash) |
| `Route.params.optional` | _Make a rule optional_     | `/any` or `/`                                                                             |
