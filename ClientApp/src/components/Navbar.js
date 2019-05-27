import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  bar: {
    display: "flex",
    justifyContent: "space-between"
  },
  menu: {
    top: "35px",
    left:"40px"
  }
};

function Navbar(props) {
  const { classes, userData, auth } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  let isAuthenticated = userData.authenticated;
  let isAdmin = userData.roles.includes("Admin");
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
            isAuthenticated && isAdmin && (<Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>)
          }
        </div>
        <div>
          {
            !isAuthenticated && (<Button color="inherit" onClick={() => auth.login()}>Login</Button>)
          }
          {
            isAuthenticated && (
              <div>
              <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}>
                {userData.email}
              </Button>
                <Menu id="simple-menu" className={classes.menu} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => auth.logout()}>Logout</MenuItem>
              </Menu>
              </div>
            )
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(Navbar);