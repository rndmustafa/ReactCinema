import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import ShowtimeBlock from './ShowtimeBlock';

const style = (theme) => ({
  flexWrap: {
    display: 'flex',
    flexWrap: 'wrap'
  },
});

function MovieShowtimes(props) {
  let currentDate = moment();

  const { classes, movieID, movieTitle } = props;
  const [showtimes, setShowtimes] = useState([]);
  useEffect(() => {
    fetch(`api/movie/${movieID}/showtimes?date=${currentDate.format()}`)
      .then(res => res.json())
      .then(data => {
        for (let showtime of data) {
          showtime.faded = currentDate > moment(showtime.startTime) || showtime.soldout;
        }
        setShowtimes(data);
      });
  }, []);

  return (
    <div>
      <Typography variant='h5' align='center' gutterBottom>
        Book tickets for {movieTitle}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {currentDate.format('LL')}
      </Typography>
      <div className={classes.flexWrap}>
        {showtimes.map(showtime => (<ShowtimeBlock
          key={showtime.showtimeID}
          time={moment(showtime.startTime).format('HH:mm:ss')}
          roomTitle={showtime.room.title}
          experienceTitle={showtime.experience.title}
          faded={showtime.faded}
          hover={!showtime.faded} />))}
      </div>
    </div>
  );
}

export default withStyles(style)(MovieShowtimes);