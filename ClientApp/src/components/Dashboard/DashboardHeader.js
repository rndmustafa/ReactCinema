import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const style = (theme) => ({
  titleSection: {
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: "space-between"
    },
  },
  button: {
    maxWidth: 180
  }
});

function DashboardHeader(props) {
  const { classes, name, handleAddDialogOpen } = props;

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">{name}s</Typography>
        <Button className={classes.button} variant="contained" color="secondary" onClick={handleAddDialogOpen}>
          <AddIcon />Add {name}
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete {name}s.</Typography>
    </div>
  );
}

export default withStyles(style)(DashboardHeader);