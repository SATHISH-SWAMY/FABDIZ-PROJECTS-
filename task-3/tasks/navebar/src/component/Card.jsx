import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CardDilogBox from './CardDilogBox'; // Import your dialog component

export default function MultiActionAreaCard() {
  // Manage dialog open state here
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      {/* full container */}
    

      
      <Box  sx={{ display: 'flex' }}>
        <Card sx={{ width: '100vh', display: 'flex' }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button>
              <ArrowDownwardIcon
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  color: 'black',
                  borderRadius: '50%',
                }}
              />
            </Button>
          </CardActions>
        </Card>

        <Button
          style={{
            marginLeft: '10px',
            marginTop: '10px',
            marginBottom: '10px',
            width: '100px',
            border: '1px solid black',
          }}
          size="small"
          color="primary"
        >
          Update
        </Button>

        <Button
          style={{
            marginLeft: '10px',
            marginTop: '10px',
            marginBottom: '10px',
            width: '100px',
            border: '1px solid black',
          }}
          size="small"
          color="primary"
        >
          Complete
        </Button>
      </Box> 

           {/* Dialog box */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
          <CardDilogBox open={openDialog} handleClose={handleDialogClose} />
      </Box>
    </Box>
  );
}
