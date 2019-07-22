import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import ShowtimeBlock from '../MovieDetail/ShowtimeBlock';

const style = {
  container: {
    padding: 5,
    margin: '10px 0px 10px 0px'
  },
  blockContainer: {
    display: 'flex',
    flexWrap:'wrap'
  },
  flexRowSpace: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

function ShowtimeGroup(props) {
  const { groupData, classes, handleEditDialogOpen, handleDeleteDialogOpen } = props;

  const formatHeaderDate = (date) => {
    return moment(date).format('MMMM DD YYYY');
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
            <ShowtimeBlock
              key={entry.showtimeGroupEntryID}
              time={entry.startTime}
              roomTitle={entry.room.title}
              experienceTitle={entry.experience.title} />
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