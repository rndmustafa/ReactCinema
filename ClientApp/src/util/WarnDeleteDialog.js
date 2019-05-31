import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

function WarnDeleteDialog(props) {
  const { open, setOpen, fetchUrl, handleDelete } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = localStorage.getItem("accessToken");
  const handleAgree = () => {
    setLoading(true);
    fetch(fetchUrl,
      {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => {
        setLoading(false);
        if (res.status === 404) {
          setError(true);
        }
        else {
          handleDelete();
          setOpen(false);
        }
      });
  }

  const handleClose = () => {
    setOpen(false);
    setError(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Warn Delete"
        aria-describedby="Warn Delete"
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="Warn Delete">
            Are you sure you want to delete this item?
          </DialogContentText>
          {error && (
            <DialogContentText id="error" style={{color:"red"}}>
              There was an error deleting this item, please try again later.
          </DialogContentText>  
          )}
          {loading && (<div style={{ display: "flex", justifyContent: "center" }}><CircularProgress /></div>)}
        </DialogContent>
        <DialogActions>
          {!loading && (
          <div>
              <Button onClick={handleClose} color="primary">
                No
            </Button>
              <Button onClick={handleAgree} color="primary" autoFocus>
                Yes
            </Button>
            </div>)}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default WarnDeleteDialog;