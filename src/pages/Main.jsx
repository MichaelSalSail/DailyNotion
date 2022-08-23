import React from 'react'
import { Link } from 'react-router-dom'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import MaterialUIPickers from './datepicker.jsx'
import RadioGroupRating from './ratings.jsx'

// For Tabs
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DailyCheckIcon from '@mui/icons-material/EmojiFoodBeverage';
import SettingsIcon from '@mui/icons-material/Settings';
import MoodBoardIcon from '@mui/icons-material/Dashboard';

// Tabs
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }



  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function BasicTabs() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              margin: '3em'
            }}
          >
            DAILY NOTION
          </Typography>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            
            <Tab icon={<DailyCheckIcon/>} label="Daily Check In" {...a11yProps(0)} />
            <Tab icon={<MoodBoardIcon/>}label="Mood Board" {...a11yProps(1)} />
            <Tab icon={<SettingsIcon/>}label="Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>
       
        <TabPanel value={value} index={0}>
          <div class="tabs"> 

                <div class="row">
                <div class="column"> 
                    <MaterialUIPickers></MaterialUIPickers>
                    <br></br> 
                    <h2> How are you doing? </h2>
                    <RadioGroupRating></RadioGroupRating>   

                    <Button variant="contained"> Submit </Button>
                </div>
                <div class="column">
                    <h2> Welcome to Daily Check-In!</h2>
                    <p> Answer a few questions </p>
                </div>
                </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
    );
  }




const Main = ({handleLogout, user, email}) =>{
    return(
        
        <div>

            <div>
              <BasicTabs></BasicTabs>
            </div>


        </div>
    );
};      
export default Main;