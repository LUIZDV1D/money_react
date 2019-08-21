import React from "react";
import { Route, Redirect } from "react-router-dom";

const uid = localStorage.getItem("u:money");

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      uid ? <Component {...props} uid={uid} /> : <Redirect to="/" />
    }
  />
);

export default PrivateRoute;