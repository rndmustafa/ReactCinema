import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Loading from '../../util/Loading';
import MovieShowtimes from './MovieShowtimes';
import MovieInfo from './MovieInfo';
import Paper from '@material-ui/core/Paper';


const style = (theme) => ({
  image: {
    width: '100%',
    height: 'auto',
    maxWidth: 325
  },
  paper: theme.paper
});

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
    <Grid container spacing={24} justify='center'>
      <Grid item lg={3} md={4}>
        <Paper className={classes.paper} style={{ maxWidth:325 }}>
          <img src={movie.imageUrl} alt={movie.title} className={classes.image} />
        </Paper>
      </Grid>
      <Grid item lg={4} md={4}>
        <Paper className={classes.paper}>
          <MovieInfo movie={movie} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </Paper>
      </Grid>
      <Grid item lg={5} md={4}>
        <Paper className={classes.paper}>
          <MovieShowtimes movieID={movieID} movieTitle={movie.title} />
        </Paper>
      </Grid>
    </Grid>
  );
}


export default withStyles(style)(Movie);