import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { fetchCreateItem, fetchPutItem } from '../../util/fetchCalls';


function ExperienceForm(props) {
  const { experienceData, setOpen, handleItemAdd, handleItemUpdate } = props;

  const [experienceTitle, setExperienceTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (experienceData) {
      setExperienceTitle(experienceData.title);
    }
  }, []);

  const handleCreate = (expData, token) => {
    let response;
    fetchCreateItem('api/experience',expData,token)
      .then(res => {
        setLoading(false);
        response = res;
        return res.json();
      })
      .then(data => {
        if (response.ok) {
          handleItemAdd(data);
          if (setOpen) {
            setOpen(false);
          }
        }
        else {
          setError(data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = (expData, token) => {
    fetchPutItem(`api/experience/${experienceData.experienceID}`, expData, token)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          res.json().then(data => setError(data));
        }
        else {
          handleItemUpdate(expData);
          if (setOpen) {
            setOpen(false);
          }
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    let expData = {
      title: experienceTitle
    };
    let token = localStorage.getItem('accessToken');
    if (!experienceData) {
      handleCreate(expData, token);
    }
    else {
      expData.experienceID = experienceData.experienceID;
      handleUpdate(expData, token);
    }
  };
  let titleText = experienceData ? 'Edit Experience' : 'New Experience';
  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e) => handleSubmit(e)}>
      <Typography variant='h6' gutterBottom align='center'>{titleText}</Typography>
      <TextField
        required
        id='title'
        label='Title'
        value={experienceTitle}
        onChange={(e) => setExperienceTitle(e.target.value)}
        margin='normal'
        variant='outlined' />
      {error.general && (
        <Typography variant="body1" style={{ color: "red" }}>
          {error.general}
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

export default ExperienceForm;