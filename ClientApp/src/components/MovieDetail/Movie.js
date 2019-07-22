import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import TrailerModal from './TrailerModal';
import Loading from '../../util/Loading';
import MovieShowtimes from './MovieShowtimes';

const style = {
  image: {
    maxWidth: 346,
    maxHeight: 534
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
      <Grid item sm={5} container>
        <Grid item sm>
          <img src={movie.imageUrl} alt={movie.title} className={classes.image} />
          <TrailerModal open={modalOpen} onClose={() => setModalOpen(false)}
            trailerUrl={movie.trailerUrl} movieTitle={movie.title} />
        </Grid>
        <Grid item sm style={{ marginLeft: 10 }}>
          <Typography variant='subtitle2' gutterBottom>Rating:
              <Typography variant='body2' inline> {movie.rating}</Typography>
          </Typography>
          <Typography variant='subtitle2' gutterBottom>Duration:
              <Typography variant='body2' inline> {movie.duration}m</Typography>
          </Typography>
          <Typography variant='subtitle2' gutterBottom>Synopsis:
              <Typography variant='body2' inline> {movie.synopsis}</Typography>
          </Typography>
          <Button variant='contained' color='default' onClick={() => setModalOpen(true)}>
            <PlayCircleOutline fontSize='large' />
            Watch Trailer
            </Button>
        </Grid>
      </Grid>
      <Grid item sm={2} />
      <Grid item sm={5}>
        <MovieShowtimes movieID={movieID} movieTitle={movie.title} />
      </Grid>
    </Grid>
  );
}


export default withStyles(style)(Movie);