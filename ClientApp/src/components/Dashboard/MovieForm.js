import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import getMovieData from '../../util/getMovieData';
import moment from 'moment';
import { fetchCreateItem, fetchPutItem } from '../../util/fetchCalls';

function MovieForm(props) {
  const { movieData, setOpen, handleItemAdd, handleItemUpdate } = props;

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState(0);
  const [releaseDate, setReleaseDate] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const [loading, setLoading] = useState(false);
  const [movieFetchLoading, setMovieFetchLoading] = useState(false);
  const [error, setError] = useState({});

  const handleMovieData = (data) => {
    if (!data.Error) {
      setTitle(data.title);
      setImageUrl(data.imageUrl);
      setRating(data.rating);
      setDuration(data.duration);
      setReleaseDate(data.releaseDate);
      setSynopsis(data.synopsis);
      setTrailerUrl(data.trailerUrl);
    }
  };

  useEffect(() => {
    if (movieData) {
      movieData.releaseDate = moment(movieData.releaseDate).format('YYYY-MM-DD');
      handleMovieData(movieData);
    }
  }, []);

  const handleCreate = (data,token) => {
    fetchCreateItem('api/movie',data,token)
      .then(res => {
        setLoading(false);
        if (res.status === 201) {
          return res.json();
        }
        else {
          setError({ general: 'Failed to create new movie'});
        }
      })
      .then(data => {
        handleItemAdd(data);
        if (setOpen) {
          setOpen(false);
        }
      })
      .catch(err => {
        setError({ general: 'An unexpected error occured' });
        console.log(err);
      });
  };

  const handleUpdate = (data,token) => {
    fetchPutItem(`api/movie/${movieData.movieID}`,data,token)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          setError({ general: 'Failed to create new movie' });
        }
        else {
          handleItemUpdate(data);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    let data = {
      title, imageUrl, trailerUrl, rating,
      duration, releaseDate, synopsis
    };
    let token = localStorage.getItem('accessToken');
    if (!movieData) {
      handleCreate(data, token);
    }
    else {
      data.movieID = movieData.movieID;
      handleUpdate(data, token);
    }
  };

  const handleDataClick = () => {
    setMovieFetchLoading(true);
    getMovieData(title)
      .then(data => {
        handleMovieData(data);
        setMovieFetchLoading(false);
      })
      .catch(err => {
        console.log(err);
        setMovieFetchLoading(false);
      });
  };

  return (
    <form style={{ display: "flex", flexDirection: "column", maxWidth: 300 }} onSubmit={(e) => handleSubmit(e)}>
      <TextField
        required
        id='title'
        label='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin='normal'
        variant='outlined' />
      <Button color="primary" variant="contained" disabled={title.length === 0} onClick={handleDataClick}>
        {!movieFetchLoading && 'Get Movie Data'}
        {movieFetchLoading && <CircularProgress color="secondary" />}
      </Button>
      <TextField
        required
        id='imageUrl'
        label='Image Url'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        margin='normal'
        variant='outlined' />
      <TextField
        required
        id='trailerUrl'
        label='Trailer Url'
        value={trailerUrl}
        onChange={(e) => setTrailerUrl(e.target.value)}
        margin='normal'
        variant='outlined' />
      <TextField
        required
        id='rating'
        label='Rating'
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        margin='normal'
        placeholder='PG-13'
        variant='outlined' />
      <TextField
        required
        id='duration'
        label='Duration (minutes)'
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        margin='normal'
        placeholder='90'
        variant='outlined' />
      <TextField
        required
        id='releaseDate'
        type="date"
        label='Release Date'
        value={releaseDate}
        onChange={e => setReleaseDate(e.target.value)}
        margin='normal'
        placeholder='2018-05-20'
        InputLabelProps={{
          shrink: true,
        }}
        variant='outlined' />
      <TextField
        required
        multiline
        rowsMax="6"
        id='synopsis'
        label='Synopsis'
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        margin='normal'
        variant='outlined' />
      {error.general && (
        <Typography variant="body1" style={{ color: "red" }}>
          There was an unexpected error. Try again later.
        </Typography>
      )}
      {!loading && (
        <Button color="secondary" variant="contained" type="submit">
          Save
        </Button>
      )}
      {loading && (
      <div style={{ display: "flex", justifyContent: "center", marginTop:10 }}>
        <CircularProgress />
      </div>)}
    </form>
    );
}

export default MovieForm;