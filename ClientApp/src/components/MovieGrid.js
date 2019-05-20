import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MovieCard from './MovieCard';

const styles = {
  flexGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:"center"
  }
};

function MovieGrid(props) {
  const { searchFilter, date, classes } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('api/movie')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
      });
  }, []);

  let filteredData = data.filter(m => m.title.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className={classes.flexGrid}>
        {filteredData.map(movie => <MovieCard key={movie.movieID} movie={movie}/>)}
    </div>
  );
}

export default withStyles(styles)(MovieGrid);