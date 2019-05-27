import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  bar: {
    display: "flex",
    justifyContent: "space-between"
  }
};

function Navbar(props) {
  const { classes, userData, auth } = props;
  let isAuthenticated = userData.authenticated;
  return (
    <AppBar position="static">
      <Toolbar className={classes.bar}>
        <div>
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </div>
        <div>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {
            isAuthenticated && (<Button color="inherit" component={Link} to="/movies">Movies</Button>)
          }
        </div>
        <div>
          {
            !isAuthenticated && (<Button color="inherit" onClick={() => auth.login()}>Login</Button>)
          }
          {
            isAuthenticated && (<Button color="inherit" onClick={() => auth.logout()}>Logout <i>{userData.email}</i></Button>)
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(Navbar);