import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from '@material-ui/core/styles';

const style = {
  root: {
    maxWidth:700
  },
  container: {
    margin: 5,
    backgroundColor: '#303f9f'
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center'
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: 5
  }
};

function InfoBar(props) {
  const { classes, setInfoBar } = props;

  return (
    <div className={classes.flexRow}>
      <SnackbarContent
        aria-describedby="infoBar"
        className={`${classes.container} ${classes.root}`}
        message={
          <span id="infoBar" className={classes.flexRow}>
            <InfoIcon className={classes.icon} />
            Log in as admin@admin.com with the password Admin123 in order to access the dashboard.
          </span>
        }
        action={[
          <IconButton onClick={() => setInfoBar(false)} key="close" aria-label="Close" color="inherit">
            <CloseIcon />
          </IconButton>
        ]}
       />
    </div>
  );
}

export default withStyles(style)(InfoBar);