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
import withFormHandlers from '../../util/withFormHandlers';

const style = (theme) => ({
  titleSection: {
    display: "flex",
    justifyContent:"space-between"
  },
  listBlock: theme.listBlock
});

function MovieList(props) {
  const { classes, formDialog,
    deleteDialog, selectedData, handleEditDialogOpen,
    handleAddDialogOpen, handleDeleteDialogOpen,
    handleItemAdd, handleItemDelete, handleItemUpdate,
    setFormDialog, setDeleteDialog } = props;

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch('api/movie')
      .then(res => res.json())
      .then(resData => {
          setMovies(resData);
      });
  }, []);

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Movies</Typography>
        <Button variant="contained" color="secondary" onClick={handleAddDialogOpen}>
          <AddIcon />Add Movie
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete movies.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/movie/${selectedData.movieID}`}
        handleDelete={() => setMovies(handleItemDelete(movies))} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={MovieForm}
        handleItemAdd={(newMovie) => setMovies(handleItemAdd(movies, newMovie))} />
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
            <IconButton onClick={() => handleDeleteDialogOpen(movie)}>
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withStyles(style)(withFormHandlers(MovieList, { itemIDKey: 'movieID' }));