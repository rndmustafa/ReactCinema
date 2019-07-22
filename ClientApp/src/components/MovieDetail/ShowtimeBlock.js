import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const style = {
  block: {
    width: 120,
    border: '2px solid #e4e4e2',
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 5px 5px 5px',
    margin: '0px 8px 8px 0px',
    transition: 'all .3s ease-out'
  },
  flexRowSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faded: {
    opacity: 0.4
  },
  hover: {
    cursor:'pointer',
    '&:hover': {
      border: '2px solid black'
    }
  }
};

function ShowtimeBlock(props) {
  const { classes, time, roomTitle, experienceTitle, faded,hover } = props;

  const formatTime = (time) => {
    let timeArray = time.split(':');
    let hour = parseInt(timeArray[0], 10);
    let suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour === 0 || hour === 12 ? 12 : hour % 12;
    return `${hour}:${timeArray[1]} ${suffix}`;
  };

  let className = `${classes.block} `;
  if (faded) {
    className += `${classes.faded} `;
  }
  if (hover) {
    className += classes.hover;
  }

  return (
    <div className={className}>
      <Typography variant='body1'>{formatTime(time)}</Typography>
      <div className={classes.flexRowSpace}>
        <Typography variant='subtitle2'>Room {roomTitle}</Typography>
        <Typography variant='subtitle2'>{experienceTitle}</Typography>
      </div>
    </div>
    );
}

export default withStyles(style)(ShowtimeBlock);