import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './mainDesign.css'
import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Warning from '@mui/icons-material/Warning';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();



const drawerWidth = 240;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const listOfTask = [
  { taskname: 'Task-1', completed: false, locked: false, discription: 'Task-1-discription' },
  { taskname: 'Task-2', completed: false, locked: true, discription: 'Task-2-discription' },
  { taskname: 'Task-3', completed: false, locked: true, discription: 'Task-3-discription' },
  { taskname: 'Task-4', completed: false, locked: true, discription: 'Task-4-discription' },
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dilogOpen, setDilogOpen] = React.useState(false);
  const [storeTask, setStoreTask] = React.useState(() => {
    // Load tasks from local storage when the component mounts
    const savedTasks = localStorage.getItem('tasks');
    console.log("savedTasks", savedTasks);
    
    return savedTasks ? JSON.parse(savedTasks) : listOfTask;
  });
  console.log("storeTask", storeTask);


  const [typingTaskName, setTypingTaskName] = React.useState('');
  const [typingDiscription, setTypingDiscription] = React.useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = React.useState(null);
  
  const [isUpdateMode, setIsUpdateMode] = React.useState(false);
  const [visibleTasks, setVisibleTasks] = React.useState({});
  const [hiddenTasks, setHiddenTasks] = React.useState([]);
  
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [completedTaskName, setCompletedTaskName] = React.useState('');

  console.log("completedTaskName",completedTaskName);
  // Save tasks to local storage whenever the task list changes
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(storeTask));
  }, [storeTask]);

  const createNewTask = () => {
    const newTask = {
      taskname: typingTaskName,
      completed: false,
      locked: true,
      discription: typingDiscription,
    };

    const updatedTasks = [...storeTask]; // Create a copy of the task array
    let newTaskIndex;

    if (selectedTaskIndex !== null) {
      updatedTasks.splice(selectedTaskIndex + 1, 0, newTask); // Insert the new task after the selected task
      newTaskIndex = selectedTaskIndex + 1;
    } else {
      updatedTasks.push(newTask); // Add new task to the end if no task is selected
      newTaskIndex = updatedTasks.length - 1;
    }

    setStoreTask(updatedTasks); // Update the task list in the state
 

    // Reset dialog state
    setTypingTaskName('');
    setTypingDiscription('');
    setDilogOpen(false);

    // Call useEffect to manage hidden tasks
    setHiddenTasks((prev) => [...prev, newTaskIndex]);
  };

  React.useEffect(() => {
    if (hiddenTasks.length > 0) {
      const updatedVisibleTasks = { ...visibleTasks };

      // Hide tasks based on hiddenTasks state
      hiddenTasks.forEach((index) => {
        updatedVisibleTasks[index] = false; // Set the visibility of the new task to false
      });

      setVisibleTasks(updatedVisibleTasks);
    }
  }, [hiddenTasks]);

  const handleUpdateTask = () => {
    const updatedTasks = storeTask.map((task, index) =>
      index === selectedTaskIndex
        ? { ...task, taskname: typingTaskName, discription: typingDiscription }
        : task
    );
    setStoreTask(updatedTasks);
    setDilogOpen(false);
    setIsUpdateMode(false); // Exit update mode
    setTypingTaskName('');
    setTypingDiscription('');
  };

  const handleCompleteTask = (index) => {
    setSelectedTaskIndex(index);
    const updatedTasks = storeTask.map((task, idx) => {
      if (idx === index) {
        // Mark the current task as completed and locked
        return { ...task, completed: true, locked: true };
      }
      if (idx === index + 1) {
        // Unlock the next task after the current task is completed
        return { ...task, locked: false };
      }
      return task;
    });
    

    setStoreTask(updatedTasks);
    setCompletedTaskName(updatedTasks[index].taskname);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000); // 2 seconds delay
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };




  const handleClose = () => {
    setDilogOpen(false);
  };

  const handleDialogOpen = (index, updateMode = false) => {
    setSelectedTaskIndex(index);
    setIsUpdateMode(updateMode); // Set update mode based on action
    if (updateMode) {
      const taskToUpdate = storeTask[index];
      setTypingTaskName(taskToUpdate.taskname);
      setTypingDiscription(taskToUpdate.discription);
    }
    setDilogOpen(true);
  };

  const toggleTasksVisibility = (index) => {
    setVisibleTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box sx={{ display: 'flex' , backgroundColor:'', height:'100%'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Divider />
        {/* Add any additional drawer content here */}
      </Drawer>

      <Main open={open}>
        <Box sx={{
          marginBottom: '10px',
        }}>
         {storeTask.map((task, index) => {
  const isTaskVisible = visibleTasks[index]; // Check if the task is visible
  const isTaskCompleted = task.completed;
  const isTaskLocked = task.locked;

  return (
    <Box key={index} sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      marginTop: '100px',
      cursor: 'pointer',
      transition: theme.transitions.create('background-color'),
    }}>
      {/* Task Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Card
          sx={{
            width: '100vh',
            display: 'flex',
            backgroundColor: isTaskCompleted
              ? '#FF964A'
              : isTaskLocked
                ? '#AFB1B3'
                : '#AE5138',
            justifyContent: 'center',
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {task.taskname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isTaskVisible && task.description} {/* Show description if the task is visible */}
              </Typography>
            </CardContent>
          </CardActionArea>

          <IconButton aria-label="more" onClick={() => toggleTasksVisibility(index)}>
            <ArrowDropDownIcon />
          </IconButton>
        </Card>

        {!isTaskCompleted && !isTaskLocked && (
          <>
            <Button variant="outlined" color="success" onClick={() => handleDialogOpen(index, true)}>
              Update
            </Button>
            <Button variant="outlined" color="success" onClick={() => handleCompleteTask(index)}>
              {isTaskCompleted ? "Completed" : "Complete"}
            </Button>
          </>
        )}
      </Box>

      {!isTaskCompleted && !isTaskLocked && (
        <Button variant="outlined" color="error" onClick={() => handleDialogOpen(index)}>
          <AddIcon />
        </Button>
      )}

      {/* Success Alert Message */}
      {alertVisible && (
  <Box>
    <Stack
      spacing={2}
      sx={{
        maxWidth: 400,
        position: "fixed",
        top: 60,
        right: 0,
        margin: '10px',
        zIndex: 1000, // Ensure it appears above other elements
        pointerEvents: 'none', // Prevent interference with other content
      }}
      data-aos="fade-left" // AOS slide effect
      data-aos-anchor="#example-anchor"
      data-aos-offset="500"
      data-aos-duration="500"
    >
      <Alert
        size="lg"
        color="success"
        variant="solid"
        invertedColors
        startDecorator={
          <AspectRatio
            variant="solid"
            ratio="1"
            sx={{
              minWidth: 40,
              borderRadius: '50%',
              boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
            }}
          >
            <div>
              <Check fontSize="xl2" />
            </div>
          </AspectRatio>
        }
        endDecorator={
          <IconButton
            variant="plain"
            sx={{
              '--IconButton-size': '32px',
              transform: 'translate(0.5rem, -0.5rem)',
            }}
          >
            <Close />
          </IconButton>
        }
        sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
      >
        <div>
          <Typography level="title-lg">{completedTaskName}</Typography>
          <Typography level="body-sm">
            has been completed successfully.
          </Typography>
        </div>
        <LinearProgress
          variant="solid"
          color="success"
          value={40}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
          }}
        />
      </Alert>
    </Stack>
  </Box>
)}

    </Box>
  );
})}

        </Box>

       
      </Main>

      <Dialog open={dilogOpen} onClose={handleClose}>
        <DialogTitle>{isUpdateMode ? 'Update Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="taskname"
            label="Task Name"
            type="text"
            fullWidth
            variant="standard"
            value={typingTaskName}
            onChange={(e) => setTypingTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="discription"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={typingDiscription}
            onChange={(e) => setTypingDiscription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={isUpdateMode ? handleUpdateTask : createNewTask}>
            {isUpdateMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
