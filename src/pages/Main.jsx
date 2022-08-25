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
        {/* TO DO: Settings page => update username, update notion API, log out, delete acct*/}
          Item Three
        </TabPanel>
      </Box>
    );
  }




const Main = ({handleLogout, user, email}) =>{
    return(
        <div className="main">
{/*             <nav>
                <Link to="/"><img src="/static/images/logo.svg" width="150" height="150" alt="My_Logo"/></Link>
                <div className="dropdown">
                    <img src="/static/images/profileIcon.png" width="150" height="150" alt="profileIcon"/>
                    <div className="dropdown-content">
                        <button className="dropdown-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav> */}
            

            <div>
              <BasicTabs></BasicTabs>
            </div>


        </div>
    );
};      
export default Main;