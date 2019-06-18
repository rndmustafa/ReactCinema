import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormDialog from '../../util/FormDialog';
import ShowtimeForm from './ShowtimeForm';

function ShowtimeList(props) {
  const [formDialog, setFormDialog] = useState(false);
  const { movieID } = props;

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => { setFormDialog(true); }}>
        <AddIcon />Add Showtimes
      </Button>
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={ShowtimeForm}
        movieID={movieID} />
    </div>
  );
}

export default ShowtimeList;