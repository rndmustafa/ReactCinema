import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';
import FormDialog from '../../util/FormDialog';
import RoomForm from './RoomForm';
import withFormHandlers from '../../util/withFormHandlers';
import DashboardHeader from './DashboardHeader';

const style = (theme) => ({
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
      <DashboardHeader name='Room' handleAddDialogOpen={handleAddDialogOpen} />
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
          <div style={{display:'flex'}}>
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