import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { fetchCreateItem, fetchPutItem } from '../../util/fetchCalls';

function RoomForm(props) {
  const { roomData, setOpen, handleItemAdd, handleItemUpdate } = props;

  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (roomData) {
      setTitle(roomData.title);
      setCapacity(roomData.capacity);
    }
  }, []);

  const handleCreate = (roomData, token) => {
    let response;
    fetchCreateItem('api/room', roomData, token)
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

  const handleUpdate = (roomData, token) => {
    fetchPutItem(`api/room/${roomData.roomID}`, roomData, token)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          res.json().then(data => setError(data));
        }
        else {
          handleItemUpdate(roomData);
          if (setOpen) {
            setOpen(false);
          }
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    let room = {
      title, capacity
    };
    let token = localStorage.getItem('accessToken');
    if (!roomData) {
      handleCreate(room, token);
    }
    else {
      room.roomID = roomData.roomID;
      handleUpdate(room, token);
    }
  };

  let titleText = roomData ? 'Edit Room' : 'New Room';

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e) => handleSubmit(e)}>
      <Typography variant='h6' gutterBottom align='center'>{titleText}</Typography>
      <TextField
        required
        id='title'
        label='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin='normal'
        variant='outlined' />
      <TextField
        required
        id='capacity'
        label='Capacity'
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
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

export default RoomForm;