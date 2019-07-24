﻿import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import MovieCard from '../Home/MovieCard';
import Paper from '@material-ui/core/Paper';
import TicketCounter from './TicketCounter';
import { fetchCreateItem, fetchPutItem } from '../../util/fetchCalls';

const style = {
  grid: {
    maxWidth: 800
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center'
  },
  flexRow: {
    display: 'flex',
    alignItems:'center'
  },
  paper: {
    padding: 10
  },
  flexSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '60%'
  },
  ticketField: {
    maxWidth: 45
  }
};

function ReservationForm(props) {
  const { classes, showtime } = props;
  const [email, setEmail] = useState('');
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={classes.flexCol}>
      <Grid container justify='center' className={classes.grid}>
        <Grid item md>
          <MovieCard movie={showtime.movie} />
        </Grid>
        <Grid item md>
          <Paper className={classes.paper}>
            <ValidatorForm className={classes.flexCol} onSubmit={e => handleSubmit(e)}>
              <Typography variant='body1'>Email my ticket to: </Typography>
              <TextValidator
                id='email'
                label='Email'
                name='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                margin='normal'
                variant='outlined'
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
              />
              <Typography variant='body1'>Select your tickets</Typography>
              <TicketCounter title='Adult' value={adultTickets} setValue={setAdultTickets} />
              <TicketCounter title='Child' value={childTickets} setValue={setChildTickets} />
              <Button color='secondary' variant='contained' type='submit'>
                Reserve Ticket
              </Button>
            </ValidatorForm>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(style)(ReservationForm);