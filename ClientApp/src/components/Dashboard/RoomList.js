import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';
import FormDialog from '../../util/FormDialog';
import RoomForm from './RoomForm';
import withFormHandlers from '../../util/withFormHandlers';

const style = (theme) => ({
  titleSection: {
    display: "flex",
    justifyContent: "space-between"
  },
  listBlock: theme.listBlock
});

function RoomList(props) {
  const { classes, formDialog,
    deleteDialog, selectedData, handleEditDialogOpen,
    handleAddDialogOpen, handleDeleteDialogOpen,
    handleItemAdd, handleItemDelete, handleItemUpdate,
    setFormDialog, setDeleteDialog } = props;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('api/room')
      .then(res => res.json())
      .then(resData => setData(resData));
  },[]);

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Rooms</Typography>
        <Button variant="contained" color="secondary" onClick={handleAddDialogOpen}>
          <AddIcon />Add Room
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete rooms.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/room/${selectedData.roomID}`}
        handleDelete={() => setData(handleItemDelete(data))} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={RoomForm}
        handleItemAdd={(newData) => setData(handleItemAdd(data, newData))}
        handleItemUpdate={(updateData) => setData(handleItemUpdate(data, updateData))}
        roomData={Object.keys(selectedData).length === 0 ? null : selectedData} />
      {data.map(item => (
        <div className={classes.listBlock} key={item.roomID}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              style={{ textDecoration: 'none' }}
              variant="h6">
              {item.title}
            </Typography>
          </div>
          <div>
            <IconButton onClick={() => handleEditDialogOpen(item)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteDialogOpen(item)}>
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withStyles(style)(withFormHandlers(RoomList, { itemIDKey: 'roomID' }));