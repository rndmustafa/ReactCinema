import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const style = {
  card: {
    width: 320,
    margin: "10px"
  },
  media: {
    height: 450
  }
};

function MovieCard(props) {
  const { classes, movie } = props;

  const shortenSynopsis = (synopsis) => {
    if (synopsis.length > 260) {
      return `${synopsis.substring(0, 260)}...`;
    }
    return synopsis;
  };

  return (
    <Card className={classes.card} key={movie.movieID}>
      <CardActionArea>
        <CardMedia
            className={classes.media}
            image={movie.imageUrl}
            title={movie.title}
            component={Link}
            to={`/movie/${movie.movieID}`}
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="h5">{movie.title}</Typography>
        <Typography variant="subtitle2">{movie.rating} | {movie.duration}</Typography>
        <Typography variant="body2">{shortenSynopsis(movie.synopsis)}</Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(style)(MovieCard);