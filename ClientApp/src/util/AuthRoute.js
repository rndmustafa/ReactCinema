import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute(props) {
  const { component: Component, userData, ...rest } = props;
  let isAuthenticated = userData.authenticated && userData.roles.includes('Admin');
  return <Route
    {...rest}
    render={(props) => isAuthenticated ? <Component {...props} /> : <Redirect to={'/'} />} />
}


export default AuthRoute;