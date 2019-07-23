import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Loading from '../../util/Loading';
import FrownIcon from '@material-ui/icons/SentimentDissatisfied';
import ReservationForm from './ReservationForm';

function Reservation(props) {
  let showtimeID = props.match.params.showtimeID;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showtime, setShowtime] = useState({});
  useEffect(() => {
    if (showtimeID !== undefined) {
      fetch(`api/showtime/${showtimeID}`)
        .then(res => {
          if (res.ok) {
            res.json().then(data => {
              setShowtime(data);
              setLoading(false);
            });
          }
          else {
            setError(true);
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
          setError(true);
          console.log(err);
        });
    }
    else {
      setLoading(false);
      setError(true);
    }
  }, []);

  if (loading) {
    return <Loading />;
  }
  else if (error) {
    return (
      <Grid container direction='column' alignItems='center'>
        <FrownIcon fontSize='large'/>
        <Typography variant='body1' align='center'>
          There was an error while trying to complete your reservation.
          Please return to the movies page and try again.
        </Typography>
      </Grid>
    );
  }

  return <ReservationForm showtime={showtime} />;
}

export default Reservation;