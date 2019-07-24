import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MinusIcon from '@material-ui/icons/RemoveCircleOutline';

const style = {
  flexRow: {
    display: 'flex',
    alignItems: 'center'
  },
  flexSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%'
  }
};

function TicketCounter(props) {
  const { classes, title, value, setValue } = props;

  return (
    <div className={classes.flexSpace}>
      <Typography variant='body1'>{value} x {title}</Typography>
      <div className={classes.flexRow}>
        <IconButton onClick={() => setValue(value + 1)}>
          <AddIcon />
        </IconButton>
        <IconButton disabled={value === 0} onClick={() => setValue(value - 1)}>
          <MinusIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default withStyles(style)(TicketCounter);