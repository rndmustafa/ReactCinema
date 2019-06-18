import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import shortid from 'shortid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ClearIcon from '@material-ui/icons/Clear';

const style = {
  formWrapper: {
    height: '60vh'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px'
  },
  flexRow: {
    display: 'flex',
    marginBottom: '10px',
    justifyContent: 'center'
  },
  submitSection: {
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center'
  }
};

function ShowtimeForm(props) {
  const { setOpen, classes, movieID } = props;
  let token = localStorage.getItem('accessToken');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [entries, setEntries] = useState([{
    id: shortid.generate(),
    startTime: '07:30',
    roomID: '',
    experienceID: ''
  }]);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    fetch('api/room')
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  const [experiences, setExperiences] = useState([]);
  useEffect(() => {
    fetch('api/experience')
      .then(res => res.json())
      .then(data => setExperiences(data));
  }, []);

  const handleEntryChange = (field, index, event) => {
    let newEntries = [...entries];
    newEntries[index][field] = event.target.value;
    setEntries(newEntries);
  };

  const handleEntryAdd = () => {
    setEntries([...entries, {
      id: shortid.generate(),
      startTime: '07:30',
      roomID: '',
      experienceID: ''
    }]);
  };

  const handleEntryDelete = (index) => {
    let newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleCreate = () => {
    let data = {
      movieID,
      fromDate,
      toDate,
      showtimeGroupEntries: entries
    };
    let requestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(`api/movie/${movieID}/showtimegroups`, requestInit)
      .then(res => {
        setLoading(false);
        console.log(res.status);
        if (res.status === 201) {
          return res.json();
        }
        else {
          setError(true);
          throw new Error('Failed to create new showtime');
        }
      })
      .then(data => {
        if (setOpen) {
          setOpen(false);
        }
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    handleCreate();
  };

  return (
    <div className={classes.formWrapper}>
      <form onSubmit={(e) => handleSubmit(e)} autoComplete='off'>
        <div className={classes.form}>
          <Typography variant='h4' gutterBottom>Add Showtimes</Typography>
          <div className={classes.flexRow}>
            <TextField
              required
              style={{ marginRight: '10px' }}
              id='fromDate'
              type='date'
              label='From Date'
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined' />
            <TextField
              required
              id='toDate'
              type='date'
              label='To Date'
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined' />
          </div>
          {entries.map((entry, index) => (
            <div className={classes.flexRow} key={entry.id}>
              <TextField
                required
                id='startTime'
                label={index === 0 ? 'Start Time' : ''}
                type='time'
                style={{ marginRight: '10px', minWidth:'102px' }}
                value={entry.startTime}
                onChange={e => handleEntryChange('startTime', index, e)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300,
                }} />
              <FormControl required style={{ marginRight: '15px', minWidth: 90 }}>
                {index === 0 && <InputLabel htmlFor="room-required">Room</InputLabel>}
                <Select
                  value={entry.roomID}
                  onChange={e => handleEntryChange('roomID', index, e)}
                  name="room"
                  inputProps={{
                    id: 'room-required'
                  }} >
                  <MenuItem value='' />
                  {rooms.map(room => <MenuItem key={room.roomID} value={room.roomID}>{room.title}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl required style={{ minWidth: 120 }}>
                {index === 0 && <InputLabel htmlFor="experience-required">Experience</InputLabel>}
                <Select
                  value={entry.experienceID}
                  onChange={e => handleEntryChange('experienceID', index, e)}
                  name="experience"
                  inputProps={{
                    id: 'experience-required',
                  }} >
                  <MenuItem value='' />
                  {experiences.map(exp => <MenuItem key={exp.experienceID} value={exp.experienceID}>{exp.title}</MenuItem>)}
                </Select>
              </FormControl>
              <IconButton onClick={() => handleEntryDelete(index)}>
                <ClearIcon  />
              </IconButton>
            </div> ))}
          <IconButton onClick={handleEntryAdd}>
            <AddIcon />
          </IconButton>
        </div>
        <div className={classes.submitSection}>
          {error && (
            <Typography variant='body1' style={{ color: 'red' }}>
              There was an unexpected error. Try again later.
        </Typography>
          )}
          {!loading && (
            <Button color='secondary' variant='contained' type='submit'>
              Save
            </Button>
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>)}
        </div>
      </form>
    </div>
  );
}

export default withStyles(style)(ShowtimeForm);