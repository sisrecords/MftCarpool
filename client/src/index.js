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
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Loader type="ThreeDots" color="#0D47A1" height="100" width="100" />
    </div>
  );
}

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
        <LoadingIndicator />
      </header>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
