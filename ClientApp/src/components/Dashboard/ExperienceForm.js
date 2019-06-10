import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


function ExperienceForm(props) {
  const { createMode, experienceData, setOpen, handleItemAdd, handleItemUpdate } = props;
  let token = localStorage.getItem('accessToken');

  const [experienceTitle, setExperienceTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!createMode && experienceData) {
      setExperienceTitle(experienceData.title);
    }
  }, []);

  const handleCreate = () => {
    setLoading(true);
    let requestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: experienceTitle })
    };

    fetch('api/experience', requestInit)
      .then(res => {
        setLoading(false);
        if (res.status === 201) {
          return res.json();
        }
        else {
          setError(true);
          throw new Error('Failed to create new experience');
        }
      })
      .then(data => {
        if (createMode && setOpen) {
          console.log(data);
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
    let expData = {
      experienceID: experienceData.experienceID,
      title: experienceTitle
    };
    let requestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expData)
    };

    fetch(`api/experience/${experienceData.experienceID}`, requestInit)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          setError(true);
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
    if (createMode) {
      handleCreate();
    }
    else {
      handleUpdate();
    }
  };

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e) => handleSubmit(e)}>
      <TextField
        required
        id='title'
        label='Title'
        value={experienceTitle}
        onChange={(e) => setExperienceTitle(e.target.value)}
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

export default ExperienceForm;