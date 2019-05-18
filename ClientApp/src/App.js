import React, { Component } from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <div className="container">
          <Route exact path='/' component={Home} />
        </div>
      </MuiThemeProvider>
    );
  }
}
