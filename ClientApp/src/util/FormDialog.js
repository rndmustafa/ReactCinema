import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function FormDialog(props) {
  const { open, setOpen, component: Component, itemName, handleItemAdd } = props;

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="new-item">
        <DialogTitle id="form-dialog-title">New {itemName}</DialogTitle>
        <DialogContent>
          <Component setOpen={setOpen} createMode={true} handleItemAdd={handleItemAdd} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormDialog;