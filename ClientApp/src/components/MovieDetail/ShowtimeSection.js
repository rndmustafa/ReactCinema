import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShowtimeBlock from './ShowtimeBlock';
import moment from 'moment';

const style = {
  flexWrap: {
    display: 'flex',
    flexWrap: 'wrap'
  },
};

function ShowtimeSection(props) {
  const { classes, date, movieID } = props;
  const [showtimes, setShowtimes] = useState([]);
  useEffect(() => {
    fetch(`api/movie/${movieID}/showtimes?date=${date}`)
      .then(res => res.json())
      .then(data => {
        for (let showtime of data) {
          showtime.faded = moment() > moment(showtime.startTime) || showtime.soldout;
        }
        setShowtimes(data);
      });
  }, []);

  return (
    <div>
      <Typography variant='body1' gutterBottom>
      {moment(date).format('LL')}
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

export default withStyles(style)(ShowtimeSection);