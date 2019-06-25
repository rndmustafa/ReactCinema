import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormDialog from '../../util/FormDialog';
import ShowtimeForm from './ShowtimeForm';
import ShowtimeGroup from './ShowtimeGroup';
import WarnDeleteDialog from '../../util/WarnDeleteDialog';

function ShowtimeList(props) {
  const { movieID } = props;

  const [formDialog, setFormDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({});

  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetch(`api/movie/${movieID}/showtimegroups`)
      .then(res => res.json())
      .then(resData => {
        setGroups(resData);
      });
  }, []);

  const handleDelete = () => {
    setGroups(groups.filter((group) => group.showtimeGroupID !== selectedGroup.showtimeGroupID));
  };

  const handleDeleteDialogOpen = (group) => {
    setSelectedGroup(group);
    setDeleteDialog(true);
  };

  const handleEditDialogOpen = (group) => {
    setSelectedGroup(group);
    setFormDialog(true);
  };

  const handleGroupAdd = (newGroup) => {
    setGroups(groups.concat(newGroup));
  };

  const handleGroupUpdate = (updatedGroup) => {
    let index = groups.findIndex(group => group.showtimeGroupID === updatedGroup.showtimeGroupID);
    let newGroups = [...groups];
    newGroups[index] = updatedGroup;
    setGroups(newGroups);
  };

  return (
    <div>
      <Button style={{marginTop: 10}} variant="contained" color="secondary" onClick={() => { setFormDialog(true); }}>
        <AddIcon />Add Showtimes
      </Button>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/movie/showtimegroups/${selectedGroup.showtimeGroupID}`}
        handleDelete={handleDelete} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={ShowtimeForm}
        movieID={movieID}
        handleItemAdd={handleGroupAdd}
        handleItemUpdate={handleGroupUpdate}
        groupData={Object.keys(selectedGroup).length === 0 ? null : selectedGroup} />
      {groups.map(group => (
        <ShowtimeGroup
          key={group.showtimeGroupID}
          groupData={group}
          handleDeleteDialogOpen={handleDeleteDialogOpen}
          handleEditDialogOpen={handleEditDialogOpen} />
      ))}
    </div>
  );
}

export default ShowtimeList;