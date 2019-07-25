import React  from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import TrailerModal from './TrailerModal';

function MovieInfo(props) {
  const { movie, modalOpen, setModalOpen } = props;

  return (
    <div>
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
      <TrailerModal open={modalOpen} onClose={() => setModalOpen(false)}
        trailerUrl={movie.trailerUrl} movieTitle={movie.title} />
    </div>
  );
}

export default MovieInfo;