import React from 'react';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';

const style = {
  frame: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform:'translate(-50%,-50%)'
  }
};

function TrailerModal(props) {
  const { onClose: handleClose, trailerUrl, movieTitle, open,classes } = props;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='Trailer'>
      <div  className={classes.frame}>
        <iframe
          width='560'
          height='315'
          src={trailerUrl}
          frameBorder='0'
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title={movieTitle}
          />
      </div>
    </Modal>
  );
}

export default withStyles(style)(TrailerModal);