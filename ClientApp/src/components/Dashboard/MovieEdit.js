import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link  from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MovieForm from './MovieForm';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import ShowtimeList from './ShowtimeList';

const style = {
  flexRow: {
    display: 'flex',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column'
  }
};

function MovieEdit(props) {
  let movieID = props.match.params.movieID;
  let classes = props.classes;

  const [value, setValue] = useState(0);
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`api/movie/${movieID}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Link
        className={classes.flexRow}
        style={{ textDecoration: 'none' }}
        component={RouterLink}
        to='/dashboard/movies'>
        <ArrowBackIcon style={{ marginRight: '5px'}} />
        <Typography variant='body2'>
          Back to Movies
        </Typography>
      </Link>
      <Typography variant='h4'>{movie.title}</Typography>
      <Tabs value={value} onChange={(e,v) => setValue(v)}>
        <Tab label='Movies' />
        <Tab label='Showtimes' />
      </Tabs>
      {loading && <CircularProgress/>}
      {value === 0 && !loading && (
        <div >
          <MovieForm movieData={movie} createMode={false} handleItemUpdate={setMovie} />
        </div>)}
      {value === 1 && !loading && (
        <div >
          <ShowtimeList movieID={movieID} />
        </div>)}
    </div>
  );
}

export default withStyles(style)(MovieEdit);