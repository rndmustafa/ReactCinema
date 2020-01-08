import React, { useState } from 'react';

function useFormHandlers(dataConfig) {
    const { itemIDKey } = dataConfig;

    const [formDialog, setFormDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const handleDeleteDialogOpen = (item) => {
        setSelectedData(item);
        setDeleteDialog(true);
    };

    const handleEditDialogOpen = (item) => {
        setSelectedData(item);
        setFormDialog(true);
    };

    const handleAddDialogOpen = () => {
        setSelectedData({});
        setFormDialog(true);
    };

    const handleItemAdd = (data, newItem) => {
        return data.concat(newItem);
    };

    const handleItemDelete = (data) => {
        return data.filter(item => item[itemIDKey] !== selectedData[itemIDKey]);
    };

    const handleItemUpdate = (data, updatedItem) => {
        let index = data.findIndex(item => item[itemIDKey] === updatedItem[itemIDKey]);
        let newData = [...data];
        newData[index] = updatedItem;
        return newData;
    };

    return {
        selectedData, formDialog, deleteDialog, setFormDialog,
        setDeleteDialog, handleEditDialogOpen, handleAddDialogOpen,
        handleDeleteDialogOpen, handleItemAdd, handleItemDelete,
        handleItemUpdate
    };
}

export default useFormHandlers;