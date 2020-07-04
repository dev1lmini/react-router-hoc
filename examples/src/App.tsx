import React from "react";
import { Router, Switch } from "react-router";
import "./App.css";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";
import Search from "./routes/Search";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Article from "./routes/Article";
import { getLinks } from "react-router-hoc";

const history = createBrowserHistory();

export const links = getLinks({
  Dashboard,
  Home,
  Search,
  Article
})

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Router history={history}>
          <Switch>
            <Home exact />
            <Search />
            <Dashboard />
            <Article />
            <NotFound />
          </Switch>
          <Link to={links.Home()}>Home</Link>
          <Link to={links.Dashboard({ role: "customer" })}>Dashboard</Link>
          <Link to={links.Search({ city: "Lviv" })}>Search</Link>
          <Link to={links.Article({ id: 10 })}>Article #10</Link>
        </Router>
      </header>
    </div>
  );
}





export default App;
