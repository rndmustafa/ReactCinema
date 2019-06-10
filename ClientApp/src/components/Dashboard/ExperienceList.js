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

const style = (theme) => ({
  titleSection: {
    display: "flex",
    justifyContent: "space-between"
  },
  listBlock: theme.listBlock
});

function ExperienceList(props) {
  const { classes } = props;

  const [experiences, setExperiences] = useState([]);
  useEffect(() => {
    fetch('api/experience')
      .then(res => res.json())
      .then(resData => {
        setExperiences(resData);
      });
  }, []);

  const [formDialog, setFormDialog] = useState(false);
  const [createMode, setCreateMode] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedExp, setSelectedExp] = useState({});
  const handleDelete = () => {
    setExperiences(experiences.filter((experience) => experience.experienceID !== selectedExp.experienceID));
  };

  const handleDeleteDialogOpen = (experience) => {
    setSelectedExp(experience);
    setDeleteDialog(true);
  };

  const handleEditDialogOpen = (experience) => {
    setCreateMode(false);
    setSelectedExp(experience);
    setFormDialog(true);
  };

  const handleExperienceAdd = (newExperience) => {
    setExperiences(experiences.concat(newExperience));
  };

  const handleExperienceUpdate = (updatedExperience) => {
    let index = experiences.findIndex(exp => exp.experienceID === updatedExperience.experienceID);
    setExperiences([
      ...experiences.slice(0, index),
      updatedExperience,
      ...experiences.slice(index+1)
    ]);
  };

  return (
    <div>
      <div className={classes.titleSection}>
        <Typography variant="h4">Experiences</Typography>
        <Button variant="contained" color="secondary" onClick={() => { setCreateMode(true); setFormDialog(true); }}>
          <AddIcon />Add Experience
        </Button>
      </div>
      <Typography variant="subtitle1" style={{ marginBottom: 10 }}>Add, edit, or delete experiences.</Typography>
      <WarnDeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        fetchUrl={`api/experience/${selectedExp.experienceID}`}
        handleDelete={handleDelete} />
      <FormDialog
        open={formDialog}
        setOpen={setFormDialog}
        component={ExperienceForm}
        handleItemAdd={handleExperienceAdd}
        handleItemUpdate={handleExperienceUpdate}
        experienceData={selectedExp}
        createMode={createMode} />
      {experiences.map(experience => (
        <div className={classes.listBlock} key={experience.experienceID}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              style={{ textDecoration: 'none' }}
              variant="h6">
              {experience.title}
            </Typography>
          </div>
          <div>
            <IconButton onClick={() => handleEditDialogOpen(experience)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteDialogOpen(experience)}>
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withStyles(style)(ExperienceList);