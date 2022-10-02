import React from 'react'

// Tab Pages
import DailyCheckIn from './dailycheckin.jsx';
import Settings from './settings.jsx';
//import MoodBoard from './moodboard.jsx';



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
      <div>
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
                    <DailyCheckIn></DailyCheckIn>
                </div>
                <div class="column">
                    <img width='300px' height='300px' alt="happy sun with text below, daily notion" src='/static/images/dark_daily_notion.png'/>
                </div>
                </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
        {/* TO DO: Settings page => update username, update notion API, log out, delete acct*/}
          <Settings></Settings>
        </TabPanel>
      </Box></div>
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