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
    maxWidth: 320,
    margin: "10px",
    maxHeight: 700
  },
  media: {
    height: 450
  }
};

function MovieCard(props) {
  const { classes, movie } = props;

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
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {movie.title}
          </Typography>
          <Typography component="p">
            {movie.synopsis}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withStyles(style)(MovieCard);