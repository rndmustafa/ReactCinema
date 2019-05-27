import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute(props) {
  const { component: Component, userData, ...rest } = props;
  let isAuthenticated = userData.authenticated === true && userData.roles === "admin";
  return <Route
    {...rest}
    render={(props) => isAuthenticated ? <Component {...props} /> : <Redirect to={'/'} />} />
}


export default AuthRoute;