import React from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import ShowtimeSection from './ShowtimeSection';

function MovieShowtimes(props) {
  const { movieID, movieTitle } = props;

  let showtimeDates = [];
  for (let i = 0; i < 4; i++) {
    showtimeDates.push(moment().add(i,'days').format());
  }
  return (
    <div>
      <Typography variant='h5' align='center' gutterBottom>
        Book tickets for {movieTitle}
      </Typography>
      {showtimeDates.map(date => <ShowtimeSection key={date} date={date} movieID={movieID} />)}
    </div>
  );
}

export default React.memo(MovieShowtimes);