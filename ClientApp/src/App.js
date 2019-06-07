import React, { useState,useEffect } from 'react';
import { Route } from 'react-router';
import Home from './components/Home/Home';
import Navbar from './components/Home/Navbar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Movie from './components/MovieDetail/Movie';
import Loading from './util/Loading';
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
      main:'#d94514'
    }
  },
  listBlock: {
    borderTop: "1px solid rgb(221,221,221)",
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 8px",
    '&:hover': {
      backgroundColor: "rgb(221,221,221)"
    },
    transition: "background-color 0.35s"
  }
});

function App(props) {
  let auth = props.auth;
  let initialUser = { authenticated: false, roles: [], permissions: [] };
  const [userData, setUserData] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (/access_token|id_token|error/.test(window.location.hash)) {
      auth.handleAuthentication(setUserData, setLoading);
    }
    else {
      let token = localStorage.getItem('accessToken');
      if (token && auth.isAuthenticated()) {
        auth.setUserInfo(token, setUserData, setLoading);
      }
      else {
        setUserData(initialUser);
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Navbar userData={userData} auth={auth} setUserData={setUserData} setLoading={setLoading} />
      <div className='container'>
        <Route exact path='/' component={Home} />
        <Route path={'/movie/:id'} component={Movie} />
        <AuthRoute path={'/dashboard'} userData={userData} component={Dashboard} />
      </div>
    </MuiThemeProvider>
  );
}

export default App;