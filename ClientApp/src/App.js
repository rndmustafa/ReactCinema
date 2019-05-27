import React, { useState,useEffect } from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Movie from './components/Movie';
import Callback from './components/Callback';
import AuthRoute from './util/AuthRoute';
import Dashboard from './components/Dashboard/Dashboard';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: '#212121'
    },
    secondary: {
      main:'#cfd8dc'
    }
  }
});

function App(props) {
  let auth = props.auth;
  const [userData, setUserData] = useState({ authenticated:false});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (/access_token|id_token|error/.test(window.location.hash)) {
      setLoading(true);
      auth.handleAuthentication(setUserData, setLoading);
    }
    else {
      let token = localStorage.getItem("accessToken");
      if (token && auth.isAuthenticated()) {
        setLoading(true);
        auth.setUserInfo(token, setUserData, setLoading);
      }
      else {
        setUserData({ authenticated: false });
      }
    }
  }, []);

  if (loading) {
    return <Callback />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Navbar userData={userData} auth={auth} />
      <div className="container">
        <Route exact path='/' component={Home} />
        <Route path={'/movie/:id'} component={Movie} />
        <AuthRoute path={'/dashboard'} userData={userData} component={Dashboard} />
      </div>
    </MuiThemeProvider>
  );
}

export default App;