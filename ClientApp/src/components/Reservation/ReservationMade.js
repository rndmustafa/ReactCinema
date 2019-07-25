import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SmileIcon from '@material-ui/icons/Mood';
import moment from 'moment';

function ReservationMade(props) {
  const { movieTitle, date } = props;

  let formattedDate = moment(date).format('MMMM Do YYYY, h:mm a');
  return (
    <Grid container direction='column' alignItems='center'>
      <SmileIcon fontSize='large' />
      <Typography variant='body1' align='center'>
        Your reservation for {movieTitle} at {formattedDate} has been made!
      </Typography>
    </Grid>
  );
}

export default ReservationMade;