import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import MovieCard from '../Home/MovieCard';
import Paper from '@material-ui/core/Paper';
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
    justifyContent: 'space-between'
  }
};

function ReservationForm(props) {
  const { classes, showtime } = props;
  const [email, setEmail] = useState('');

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