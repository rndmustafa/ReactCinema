import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShowtimeBlock from './ShowtimeBlock';
import moment from 'moment';
import { Link } from 'react-router-dom';

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
          showtime.faded = showtime.soldout || moment() > moment(showtime.startTime);
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
        {showtimes.map(showtime => {
          let block = (<ShowtimeBlock
            key={showtime.showtimeID}
            time={moment(showtime.startTime).format('HH:mm:ss')}
            roomTitle={showtime.room.title}
            experienceTitle={showtime.experience.title}
            faded={showtime.faded}
            hover={!showtime.faded} />);

          if (showtime.faded) {
            return block;
          }
          return (
            <Link key={showtime.showtimeID} to={`/reserve/${showtime.showtimeID}`} style={{ textDecoration:'none' }}>
              {block}
            </Link> );
        })}
      </div>
    </div>
  );
}

export default withStyles(style)(ShowtimeSection);