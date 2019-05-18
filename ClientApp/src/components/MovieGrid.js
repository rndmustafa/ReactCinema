﻿import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MovieCard from './MovieCard';

const styles = {
  flexGrid: {
    display: "flex",
    flexWrap: "wrap",
    width:"85%"
  },
  flexGridContainer: {
    display: "flex",
    justifyContent: "center",
    width: 1200
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
    <div className={classes.flexGridContainer}>
      <div className={classes.flexGrid}>
        {filteredData.map(movie => <MovieCard movie={movie}/>)}
      </div>
    </div>
  );
}

export default withStyles(styles)(MovieGrid);