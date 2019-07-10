﻿import React, { useState, useEffect } from 'react';
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
import moment from 'moment';
import { fetchCreateItem, fetchPutItem } from '../../util/fetchCalls';

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
    flexDirection: 'column',
    justifyContent: 'center'
  }
};

function ShowtimeForm(props) {
  const { setOpen, classes, movieID, groupData, handleItemAdd, handleItemUpdate } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [showtimeGroupID, setShowtimeGroupID] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [entries, setEntries] = useState([{
    showtimeGroupEntryID: 0,
    shortIdentification: shortid.generate(),
    startTime: '',
    roomID: -1,
    experienceID: -1
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

  useEffect(() => {
    if (groupData) {
      setShowtimeGroupID(groupData.showtimeGroupID);
      setFromDate(moment(groupData.fromDate).format('YYYY-MM-DD'));
      setToDate(moment(groupData.toDate).format('YYYY-MM-DD'));

      let entries = []; 
      for (let entry of groupData.showtimeGroupEntries) {
        entries.push({
          showtimeGroupEntryID: entry.showtimeGroupEntryID,
          shortIdentification: shortid.generate(),
          startTime: entry.startTime,
          roomID: entry.roomID,
          experienceID: entry.experienceID
        });
      }
      setEntries(entries);
    }
  },[]);

  const handleEntryChange = (field, index, event) => {
    let newEntries = [...entries];
    newEntries[index][field] = event.target.value;

    let shortId = newEntries[index].shortIdentification;
    if (error[shortId]) {
      let newError = { ...error };
      delete newError[shortId];
      setError(newError);
    }
  
    setEntries(newEntries);
  };

  const handleEntryAdd = () => {
    setEntries([...entries, {
      shortIdentification: shortid.generate(),
      startTime: '',
      roomID: -1,
      experienceID: -1
    }]);
  };

  const handleEntryDelete = (index) => {
    let newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const setRelatedFields = (newGroup) => {
    for (let entry of newGroup.showtimeGroupEntries) {
      let roomTitle = rooms.find(r => r.roomID === entry.roomID).title;
      let expTitle = experiences.find(e => e.experienceID === entry.experienceID).title;
      entry.room = { title: roomTitle };
      entry.experience = { title: expTitle };
    }
    return newGroup;
  };

  const handleCreate = (formData, token) => {
    let response;
    fetchCreateItem(`api/movie/${movieID}/showtimegroups`, formData, token)
      .then(res => {
        setLoading(false);
        response = res;
        return res.json();
      })
      .then(data => {
        if (!response.ok) {
          setError(data);
        }
        else {
          handleItemAdd(setRelatedFields(data));
          if (setOpen) {
            setOpen(false);
          }
        }
      })
      .catch(err => {
        setError({ general: 'There was an unexpected error. Try again later.'});
        console.log(err);
      });
  };

  const handleUpdate = (formData, token) => {
    fetchPutItem(`api/movie/showtimegroups/${groupData.showtimeGroupID}`,
      formData, token)
      .then(res => {
        setLoading(false);
        if (res.status === 400) {
          res.json().then(data => setError(data));
        }
        else {
          handleItemUpdate(setRelatedFields(formData));
          if (setOpen) {
            setOpen(false);
          }
        }
      })
      .catch(err => {
        setError({ general: 'There was an unexpected error. Try again later.' });
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    let formData = {
      showtimeGroupID,
      movieID,
      fromDate,
      toDate,
      showtimeGroupEntries: entries
    };
    let token = localStorage.getItem('accessToken');
    if (!groupData) {
      handleCreate(formData, token);
    }
    else {
      handleUpdate(formData, token);
    }
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
            <div className={classes.flexRow} key={entry.shortIdentification}>
              <TextField
                error={entry.startTime.length === 0 || entry.shortIdentification in error}
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
                  error={entry.roomID === -1}
                  onChange={e => handleEntryChange('roomID', index, e)}
                  name="room"
                  inputProps={{
                    id: 'room-required'
                  }} >
                  <MenuItem value={-1} />
                  {rooms.map(room => <MenuItem key={room.roomID} value={room.roomID}>{room.title}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl required style={{ minWidth: 120 }}>
                {index === 0 && <InputLabel htmlFor="experience-required">Experience</InputLabel>}
                <Select
                  value={entry.experienceID}
                  error={entry.experienceID === -1}
                  onChange={e => handleEntryChange('experienceID', index, e)}
                  name="experience"
                  inputProps={{
                    id: 'experience-required',
                  }} >
                  <MenuItem value={-1} />
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
          {error.general && (
            <Typography variant='body1' style={{ color: 'red', textAlign:'center' }}>
              {error.general}
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