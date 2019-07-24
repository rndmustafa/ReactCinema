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
import TicketPrices from '../../util/TicketPrices';
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
  paper: {
    padding: 10
  },
  flexSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '70%'
  },
  ticketContainer: {
    borderTop: '1px solid rgba(190,190,190,0.4)',
    borderBottom: '1px solid rgba(190,190,190,0.4)',
    width: '100%',
    marginTop: 5,
    marginBottom: 5
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

  let total = adultTickets * TicketPrices.adult + childTickets * TicketPrices.child;
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
              <div className={`${classes.ticketContainer} ${classes.flexCol}`}>
                <TicketCounter title='Adult' price={TicketPrices.adult} value={adultTickets} setValue={setAdultTickets} />
                <TicketCounter title='Child' price={TicketPrices.child} value={childTickets} setValue={setChildTickets} />
              </div>
              <div className={classes.flexSpace} style={{ marginBottom:5 }}>
                <Typography variant='body1' style={{width:74}}>Total</Typography>
                <Typography variant='body1'>${total}</Typography>
                <span style={{width:96}}/>
              </div>
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