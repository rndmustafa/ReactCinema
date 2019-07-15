import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import FormDialog from '../../util/FormDialog';
import ShowtimeForm from './ShowtimeForm';
import ShowtimeGroup from './ShowtimeGroup';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';
import withFormHandlers from '../../util/withFormHandlers';

function ShowtimeList(props) {
  const { movieID, formDialog,
    deleteDialog, selectedData, handleEditDialogOpen,
    handleAddDialogOpen, handleDeleteDialogOpen,
    handleItemAdd, handleItemDelete, handleItemUpdate,
    setFormDialog, setDeleteDialog } = props;

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`api/movie/${movieID}/showtimegroups`)
      .then(res => res.json())
      .then(jsonData => setData(jsonData));
  }, []);

  return (
    <div>
      <Button style={{ marginTop: 10 }} variant="contained" color="secondary" onClick={handleAddDialogOpen}>
        <AddIcon />Add Showtimes
      </Button>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/movie/showtimegroups/${selectedData.showtimeGroupID}`}
        handleDelete={() => setData(handleItemDelete(data))} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={ShowtimeForm}
        movieID={movieID}
        handleItemAdd={(newData) => setData(handleItemAdd(data, newData))}
        handleItemUpdate={(updateData) => setData(handleItemUpdate(data, updateData))}
        groupData={Object.keys(selectedData).length === 0 ? null : selectedData} />
      {data.map(item => (
        <ShowtimeGroup
          key={item.showtimeGroupID}
          groupData={item}
          handleDeleteDialogOpen={handleDeleteDialogOpen}
          handleEditDialogOpen={handleEditDialogOpen} />
      ))}
    </div>
  );
}

export default withFormHandlers(ShowtimeList, { itemIDKey: 'showtimeGroupID'});