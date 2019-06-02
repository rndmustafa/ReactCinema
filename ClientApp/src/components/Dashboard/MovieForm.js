import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import getMovieData from '../../util/getMovieData';
import moment from 'moment';

function MovieForm(props) {
  const { createMode, movieData, setOpen, handleItemAdd } = props;
  let token = localStorage.getItem('accessToken');

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const [loading, setLoading] = useState(false);
  const [movieFetchLoading, setMovieFetchLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleMovieData = (data, fromProp) => {
    if (!data.Error) {
      setTitle(data.title);
      setImageUrl(data.imageUrl);
      setRating(data.rating);
      setDuration(data.duration);
      setReleaseDate(data.releaseDate);
      setSynopsis(data.synopsis);
      setTrailerUrl(data.trailerUrl);
    }
    if (!fromProp) {
      setMovieFetchLoading(false);
    }
  };

  useEffect(() => {
    if (movieData) {
      movieData.releaseDate = moment(movieData.releaseDate).format('YYYY-MM-DD');
      handleMovieData(movieData, true);
    }
  }, []);

  const handleCreate = () => {
    setLoading(true);
    let data = {
      title, imageUrl, trailerUrl, rating,
      duration, releaseDate, synopsis
    };
    let requestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch('api/movie', requestInit)
      .then(res => {
        setLoading(false);
        if (res.status === 201) {
          return res.json();
        }
        else {
          setError(true);
          throw new Error('Failed to create new movie');
        }
      })
      .then(data => {
        if (setOpen) {
          handleItemAdd(data);
          setOpen(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    let data = {
      movieID: movieData.movieID,
      title, imageUrl, trailerUrl, rating,
      duration, releaseDate, synopsis
    };
    let requestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(`api/movie/${movieData.movieID}`, requestInit)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          setError(true);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (createMode) {
      handleCreate();
    }
    else {
      handleUpdate();
    }
  }

  const handleDataClick = () => {
    setMovieFetchLoading(true);
    getMovieData(title, handleMovieData);
  };

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e) => handleSubmit(e)}>
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
        label='Duration'
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        margin='normal'
        placeholder='2h 10m'
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
      {error && (
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>)}
    </form>
    );
}

export default MovieForm;