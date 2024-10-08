import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { Box, TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CardDilogBox({ storeTask, setStoreTask }) { // Receive both storeTask and setStoreTask
  const [open, setOpen] = useState(false);
  const [typingTaskName, setTypingTaskName] = useState('');
  const [typingDiscription, setTypingDiscription] = useState('');

  const createNewTask = () => {
    const newTask = {
      id: storeTask.length + 1,
      TaskName: typingTaskName,
      discription: typingDiscription,
    };
    setStoreTask([...storeTask, newTask]); // Update task list
    setTypingTaskName('');
    setTypingDiscription('');
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <AddIcon
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Create New Task"}</DialogTitle>
        <DialogContent>
          <Box
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
              padding: '100px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '50px',
            }}
          >
            <TextField
              style={{ width: '50vh' }}
              value={typingTaskName}
              onChange={(e) => setTypingTaskName(e.target.value)}
              id="outlined-basic"
              label="Task Name"
              variant="outlined"
            />
            <TextField
              style={{ width: '50vh' }}
              value={typingDiscription}
              onChange={(e) => setTypingDiscription(e.target.value)}
              id="outlined-basic"
              label="Description"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createNewTask}>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
