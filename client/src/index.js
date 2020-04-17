import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Main from "./components/Main";
import React from 'react';
import ViewRideDialog from "./components/ViewRideDialog";
import NotFoundPage from "./components/NotFoundPage";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const routes = [
  {
    path: "/app",
    component: Main
  },
  {
    path: "/ride/:rideID",
    component: ViewRideDialog
  },
  {
    path: "/*",
    component: NotFoundPage,
  }
];

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            {routes.map((route, i) => (
              <Route
                exact
                key={i}
                path={route.path}
                render={props => (
                  // pass the sub-routes down to keep nesting
                  <route.component {...props} routes={route.routes} />
                )}
              />
            ))}
          </Switch>
        </Router>
      </header>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
