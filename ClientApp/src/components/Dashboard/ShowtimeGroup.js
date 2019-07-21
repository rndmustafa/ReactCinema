import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

const style = {
  container: {
    padding: 5,
    margin: '10px 0px 10px 0px'
  },
  blockContainer: {
    display: 'flex',
    flexWrap:'wrap'
  },
  block: {
    width: 120,
    border: '2px solid #e4e4e2',
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 5px 5px 5px',
    margin: '0px 8px 8px 0px'
  },
  flexRowSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems:'center'
  }
};

function ShowtimeGroup(props) {
  const { groupData, classes, handleEditDialogOpen, handleDeleteDialogOpen } = props;

  const formatHeaderDate = (date) => {
    return moment(date).format('MMMM DD YYYY');
  };

  const formatTime = (time) => {
    let timeArray = time.split(':');
    let hour = parseInt(timeArray[0],10);
    let suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour === 0 || hour === 12 ? 12 : hour % 12;
    return `${hour}:${timeArray[1]} ${suffix}`;
  };

  let headerDate = formatHeaderDate(groupData.fromDate);
  if (groupData.toDate !== groupData.fromDate) {
    headerDate += ` - ${formatHeaderDate(groupData.toDate)}`;
  }

  return (
    <div className={`${classes.container} ${classes.flexRowSpace}`}>
      <div>
        <Typography variant='h6'>{headerDate}</Typography>
      <div className={classes.blockContainer}>
        {groupData.showtimeGroupEntries.map(entry => (
          <div key={entry.showtimeGroupEntryID} className={classes.block}>
            <Typography variant='body1'>{formatTime(entry.startTime)}</Typography>
            <div className={classes.flexRowSpace}>
              <Typography variant='subtitle2'>Room {entry.room.title}</Typography>
              <Typography variant='subtitle2'>{entry.experience.title}</Typography>
            </div>
          </div>
          ))}
        </div>
      </div>
      <div>
        <IconButton onClick={() => handleEditDialogOpen(groupData)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteDialogOpen(groupData)}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default withStyles(style)(ShowtimeGroup);