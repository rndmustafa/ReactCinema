import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Route, Link } from 'react-router-dom';
import MovieList from './MovieList';
import MovieEdit from './MovieEdit';
import RoomList from './RoomList';
import ExperienceList from './ExperienceList';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MovieIcon from '@material-ui/icons/Movie';
import LocalPlayIcon from '@material-ui/icons/LocalPlay';
import StarIcon from '@material-ui/icons/Star';
import Paper from '@material-ui/core/Paper';

const style = (theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: theme.paper
});

function Dashboard(props) {
  const { classes, match } = props;

  return (
    <div className={classes.flexCol}>
      <Grid container direction="row" justify="center" spacing={24} style={{ maxWidth: 900 }}>
        <Grid item md={3}>
          <Paper className={classes.paper}>
            <List component="nav">
              <ListItem button component={Link} to={`${match.url}/movies`}>
                <ListItemIcon>
                  <MovieIcon />
                </ListItemIcon>
                <ListItemText primary="Movies" />
              </ListItem>
              <ListItem button component={Link} to={`${match.url}/rooms`}>
                <ListItemIcon>
                  <LocalPlayIcon />
                </ListItemIcon>
                <ListItemText primary="Rooms" />
              </ListItem>
              <ListItem button component={Link} to={`${match.url}/experiences`}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Experiences" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item md={9}>
          <Paper className={classes.paper}>
            <Route exact path={[`${match.path}/movies`, `${match.path}`]} component={MovieList} />
            <Route path={`${match.path}/movies/:movieID`} component={MovieEdit} />
            <Route path={`${match.path}/rooms`} component={RoomList} />
            <Route path={`${match.path}/experiences`} component={ExperienceList} />
         </Paper>
        </Grid>
      </Grid>
    </div>
  );

}

export default withStyles(style)(Dashboard);