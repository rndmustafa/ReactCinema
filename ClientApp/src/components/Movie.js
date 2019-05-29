import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import TrailerModal from './TrailerModal';


const style = {
  hr: {
    width: '92%'
  },
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

  useEffect(() => {
    fetch(`api/movie/${movieID}`)
      .then(res => res.json())
      .then(data => { setMovie(data); });
  }, []);

  return (
    <Grid container direction='column' alignItems='center' >
      <Grid item />
      <Typography variant='h3'>{movie.title}</Typography>
      <hr className={classes.hr} />
      <Grid item sm={11} container>
        <Grid item sm={6} container>
          <Grid item xs>
            <img src={movie.imageUrl} alt={movie.title} className={classes.img} />
            <Button variant='contained' color='default' onClick={() => setModalOpen(true)}>
              <PlayCircleOutline fontSize='large' />
              Watch Trailer
            </Button>
            <TrailerModal open={modalOpen} onClose={() => setModalOpen(false)}
              trailerUrl={movie.trailerUrl} movieTitle={movie.title} />
          </Grid>
          <Grid item xs style={{marginLeft: 10}}>
            <Typography variant='subtitle2' gutterBottom>Rating:
              <Typography variant='body2' inline> {movie.rating}</Typography>
            </Typography>
            <Typography variant='subtitle2' gutterBottom>Duration:
              <Typography variant='body2' inline> {movie.duration}</Typography>
            </Typography>
            <Typography variant='subtitle2' gutterBottom>Synopsis:
              <Typography variant='body2' inline> {movie.synopsis}</Typography>
            </Typography>
          </Grid>
        </Grid>
        <Grid item sm={6} container justify='center'>
          <Typography variant='h5'>Showtimes</Typography>
        </Grid>
      </Grid>
      <Grid item />
    </Grid>
  );
}


export default withStyles(style)(Movie);