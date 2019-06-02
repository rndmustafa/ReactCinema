import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';
import FormDialog from '../../util/FormDialog';
import MovieForm from './MovieForm';

const style = {
  titleSection: {
    display: "flex",
    justifyContent:"space-between"
  },
  listBlock: {
    borderTop: "1px solid rgb(221,221,221)",
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 8px",
    '&:hover': {
      backgroundColor: "rgb(221,221,221)"
    },
    transition:"background-color 0.35s"
  },
  img: {
    height: 64,
    width: 64,
    marginRight: 10
  }
};

function MovieList(props) {
  const { classes } = props;
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(-1);

  const handleDialogOpen = (movieID) => {
    setSelectedMovie(movieID);
    setDeleteDialog(true);
  }

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch('api/movie')
      .then(res => res.json())
      .then(resData => {
          setMovies(resData);
      });
  }, []);

  const handleDelete = () => {
    setMovies(movies.filter(movie => movie.movieID !== selectedMovie));
  }

  const handleMovieAdd = (newMovie) => {
    setMovies(movies.concat(newMovie));
  }

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Movies</Typography>
        <Button variant="contained" color="secondary" onClick={() => setFormDialog(true)}>
          <AddIcon />Add Movie
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete movies.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/movie/${selectedMovie}`}
        handleDelete={handleDelete} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        itemName={'Movie'}
        component={MovieForm}
        handleItemAdd={handleMovieAdd} />
      {movies.map(movie => (
        <div className={classes.listBlock} key={movie.movieID}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              style={{ textDecoration: 'none' }}
              variant="h6"
              component={Link}
              to={`${props.match.url}/${movie.movieID}`}>
              {movie.title}
            </Typography>
          </div>
          <div>
            <IconButton component={Link} to={`${props.match.url}/${movie.movieID}`}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDialogOpen(movie.movieID)}>
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withStyles(style)(MovieList);