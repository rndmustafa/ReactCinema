import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';
import FormDialog from '../../util/FormDialog';
import MovieForm from './MovieForm';
import useFormHandlers from '../../util/useFormHandlers';
import DashboardHeader from './DashboardHeader';

const style = (theme) => ({
  listBlock: theme.listBlock
});

function MovieList(props) {
  const { classes } = props;

  let formHandlers = useFormHandlers({ itemIDKey: 'movieID' });
  const { formDialog, deleteDialog,
    selectedData,handleAddDialogOpen, handleDeleteDialogOpen,
    handleItemAdd, handleItemDelete, setFormDialog,
    setDeleteDialog } = formHandlers;

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
      <DashboardHeader name='Movie' handleAddDialogOpen={handleAddDialogOpen} />
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
          <div style={{ display: 'flex' }}>
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

export default withStyles(style)(MovieList);
