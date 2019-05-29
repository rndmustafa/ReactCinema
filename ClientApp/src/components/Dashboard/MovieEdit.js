import React, { useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Route, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';

const style = {
  titleSection: {
    display: "flex",
    justifyContent:"space-between"
  },
  listBlock: {
    borderTop: "1px solid rgb(221,221,221)",
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 8px",
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

function MovieEdit(props) {
  const { classes } = props;
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [fetchUrl, setFetchUrl] = useState('');
  const handleDelete = (movieID) => {
    setFetchUrl(`api/movie/${movieID}`);
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

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Movies</Typography>
        <Button variant="contained" color="secondary"><AddIcon />Add Movie</Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete movies.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={fetchUrl} />
      {movies.map(movie => (
        <div className={classes.listBlock} key={movie.movieID}>
          <div style={{display:"flex"}}>
            <img src={movie.imageUrl} className={classes.img} />
            <Typography variant="h6">{movie.title}</Typography>
          </div>
          <div>
            <EditIcon style={{cursor:"pointer"}} />
            <ClearIcon onClick={() => handleDelete(movie.movieID)} style={{ cursor: "pointer" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default withStyles(style)(MovieEdit);