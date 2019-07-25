import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import TrailerModal from './TrailerModal';
import Loading from '../../util/Loading';
import MovieShowtimes from './MovieShowtimes';
import MovieInfo from './MovieInfo';

const style = {
  image: {
    width: '100%',
    height: 'auto',
    maxWidth: 325
  }
};

function Movie(props) {
  const { classes } = props;
  let movieID = props.match.params.id;
  const [movie, setMovie] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`api/movie/${movieID}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid container justify='center'>
      <Grid item lg={3}>
        <img src={movie.imageUrl} alt={movie.title} className={classes.image} />
      </Grid>
      <Grid item lg={4}>
        <MovieInfo movie={movie} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Grid>
      <Grid item lg={5}>
        <MovieShowtimes movieID={movieID} movieTitle={movie.title} />
      </Grid>
    </Grid>
  );
}


export default withStyles(style)(Movie);