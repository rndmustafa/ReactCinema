import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

function FormDialog(props) {
  const { open, setOpen, component: Component, ...rest } = props;

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="new-item">
        <DialogContent>
          <Component setOpen={setOpen} {...rest} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormDialog;