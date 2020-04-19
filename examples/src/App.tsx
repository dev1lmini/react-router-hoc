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

const history = createBrowserHistory();

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
          <Link to={Home.link()}>Home</Link>
          <Link to={Dashboard.link({ role: "customer" })}>Dashboard</Link>
          <Link to={Search.link({ city: "Lviv" })}>Search</Link>
          <Link to={Article.link({ id: 10 })}>Article #10</Link>
        </Router>
      </header>
    </div>
  );
}





export default App;
