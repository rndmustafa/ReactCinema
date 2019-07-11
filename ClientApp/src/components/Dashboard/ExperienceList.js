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
import ExperienceForm from './ExperienceForm';
import withFormHandlers from '../../util/withFormHandlers';

const style = (theme) => ({
  titleSection: {
    display: "flex",
    justifyContent: "space-between"
  },
  listBlock: theme.listBlock
});

function ExperienceList(props) {
  const { classes, formDialog,
    deleteDialog, selectedData, handleEditDialogOpen,
    handleAddDialogOpen, handleDeleteDialogOpen,
    handleItemAdd, handleItemDelete, handleItemUpdate, 
    setFormDialog, setDeleteDialog } = props;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('api/experience')
      .then(res => res.json())
      .then(jsonData => setData(jsonData));
  }, []);

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Experiences</Typography>
        <Button variant="contained" color="secondary" onClick={handleAddDialogOpen}>
          <AddIcon />Add Experience
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete experiences.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/experience/${selectedData.experienceID}`}
        handleDelete={() => setData(handleItemDelete(data))} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={ExperienceForm}
        handleItemAdd={(newData) => setData(handleItemAdd(data,newData))}
        handleItemUpdate={(updateData) => setData(handleItemUpdate(data,updateData))}
        experienceData={Object.keys(selectedData).length === 0 ? null : selectedData} />
      {data.map(item => (
        <div className={classes.listBlock} key={item.experienceID}>
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

export default withStyles(style)(withFormHandlers(ExperienceList, { itemIDKey: 'experienceID' }));