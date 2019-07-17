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
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem("accessToken");

  const handleAgree = () => {
    setLoading(true);
    fetch(fetchUrl,
      {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => {
        setLoading(false);
        if (!res.ok) {
          setError(true);
          res.json().then(data => {
            if (data.general) {
              setErrorMessage(data.general);
            }
          });
        }
        else {
          handleDelete();
          setOpen(false);
        }
      })
      .catch(err => console.log(err));
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setErrorMessage('');
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Warn Delete"
        aria-describedby="Warn Delete"
      >
        <div>
          <DialogTitle>Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="Warn Delete">
              Are you sure you want to delete this item?
            </DialogContentText>
            {error && (
              <DialogContentText id="error" style={{ color: "red" }}>
                {errorMessage || 'There was an error deleting this item, please try again later.'}
              </DialogContentText>
            )}
          </DialogContent>
        </div>
        <DialogActions>
          {loading && <CircularProgress />}
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