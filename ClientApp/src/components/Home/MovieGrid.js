import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MovieCard from './MovieCard';
import FrownIcon from '@material-ui/icons/SentimentDissatisfied';
import Typography from '@material-ui/core/Typography';

const styles = {
  flexGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center'
  }
};

function MovieGrid(props) {
  const { searchFilter, showDate, classes } = props;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`api/movie?showdate=${showDate}`)
      .then(res => res.json())
      .then(resData => {
        setLoading(false);
        setData(resData);
      });
  }, [showDate]);

  let filteredData = data.filter(m => m.title.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className={classes.flexGrid}>
      {!loading && filteredData.length === 0 && (
        <div className={classes.flexCol}>
          <FrownIcon fontSize="large" />
          <Typography variant="subtitle1">
            No movies found with the current search parameters. 
          </Typography>
        </div>
      )}  
      {filteredData.map(movie => <MovieCard key={movie.movieID} margin={10} movie={movie}/>)}
    </div>
  );
}

export default withStyles(styles)(MovieGrid);