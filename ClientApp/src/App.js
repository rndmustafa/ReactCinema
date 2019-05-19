import React, { Component } from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Movie from './components/Movie';

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

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <div className="container">
          <Route exact path='/' component={Home} />
          <Route path={'/movie/:id'} component={Movie} />
        </div>
      </MuiThemeProvider>
    );
  }
}
