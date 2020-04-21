# React Router Route Higher Order Componet

**The binding for react-router that provides a new way of declaring react-router route with params validation and typescript support**

The binding helps you to declare a react-router route in the component itself or in a container. Preferably this is created to define a route in the component which helps you to contain everything in one file.
---

![Image](https://i.ibb.co/hF7bn5d/out.gif)

### Route declaration with params validation

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

export default SearchRoute<Props>(
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

### Use it as a regular route component in the router

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

### Generate link to the route

```tsx
<Router>
  <Link to={Dashboard.link({ role: 'customer', region: 'Staryi Sambir'})}>
</Router>
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

### Validation rules for route params

_Route HOC provides a way to declare validation rules for route params, once you apply the rule it will influence route matching._

```tsx
  role: Route.params.enum("customer", "employee"),
  region: Route.params.string,
  storage: Route.params.number,
  hash: Route.params.regex(/[0-9a-fA-f]{40}/),
  optional: Route.params.string.optional
```

| Param    | Rule                            | Match                      | Example                                    |
| :------- | :------------------------------ | :------------------------- | :----------------------------------------- |
| region   | **String**                      | _Match any value_          | `/:any`                                    |
| storage  | **Number**                      | _Match only numbers_       | `/7`                                       |
| role     | **Enum**                        | _Match one of variants_    | `/customer` or `/employee`                 |
| hash     | **Regex** `(/[0-9a-fA-f]{40}/)` | _Match commit hash number_ | `ca82a6dff817ec66f44342007202690a93763949` |
| optional | **Optional**                    | _Make a rule optional_     | `/any` or `/`                              |

