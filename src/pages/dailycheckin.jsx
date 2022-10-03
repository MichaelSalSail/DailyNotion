import * as React from 'react';
import { useCallback } from 'react'
import ReactDOM from 'react-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { Button } from 'primereact/button';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

import {Alert} from "@mui/material";
import {nodeRecent} from '../utils.js';

import fireDB from '../fire.js';
import {getDatabase, ref, onValue, set, update, push, child, get} from 'firebase/database';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon fontSize="large" color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize="large" color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon fontSize="large" color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon fontSize="large" color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon fontSize="large" color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span  {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};


export default function DailyCheckIn() {
  const [DateValue, setDateValue] = React.useState(new Date());
  const [MoodValue, setMoodValue] = React.useState('3');

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
    //console.log(newValue)
  };

  const handleMoodChange = (newValue) => {
    setMoodValue(newValue.target.value);
  };

  function handleSubmit() {
      fireDB.WriteDailyCheckIn(DateValue, MoodValue);
  };

  const [disabled, setDisable] = React.useState(false);
  const [some_msgs, setExistM] = React.useState(false);
  // GET all msgs and return as alert components
  const alertS = () => {
    let currentUsr=fireDB.getUser();
    const fdbk_2day=nodeRecent();
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${currentUsr}/feedback/${fdbk_2day}`)).then((snapshot) => {
      let all_alerts=[];
      let current="";
      for(current in snapshot.val())
      {
        if(snapshot.val()[current].color==="blue")
          all_alerts.push(<Alert severity="info">{snapshot.val()[current].text}</Alert>);
        else if(snapshot.val()[current].color==="red")
          all_alerts.push(<Alert severity="error">{snapshot.val()[current].text}</Alert>);
        else if(snapshot.val()[current].color==="yellow")
          all_alerts.push(<Alert severity="warning">{snapshot.val()[current].text}</Alert>);
        else if(snapshot.val()[current].color==="green")
          all_alerts.push(<Alert severity="success">{snapshot.val()[current].text}</Alert>);
        else
          all_alerts.push(<Alert severity="success">{snapshot.val()[current].text}</Alert>);
      }
      ReactDOM.render(all_alerts,document.getElementById('all_alrts'));
      console.log("The alerts should have been updated.");
    }).catch((error) => {
      console.error(error);
    });
  };
  // check if any msgs are present for the day
  // if not, return false and display no alerts
  const existMsgs = () => {
    // current user as shown unser 'Users' in Firebase Realtime
    let currentUsr=fireDB.getUser();
    console.log(currentUsr);
    // obtain the proper node name (yesterdays date if b4 10PM, todays if after 10PM)
    const fdbk_2day=nodeRecent();
    console.log(fdbk_2day);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${currentUsr}/feedback/${fdbk_2day}/msg_1`)).then((snapshot) => {
      if (snapshot.exists()) {
        setExistM(true);
        console.log("There exists msgs! Let's update the frontend.");
        alertS();
      }/* else {
        setExistM(false);
      }*/
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      {some_msgs ? (
        <div id="all_alrts"></div>
      ) : (
        console.log("The page just loaded OR there exist no msgs.")
      )}
      <Button disabled={disabled} onClick={()=>{existMsgs();setDisable(true)}}>msgs</Button>
      <h2> How are you doing? </h2>
      <br></br>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="MM/dd/yyyy"
            value={DateValue}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
      <br></br>

      <StyledRating
        name="highlight-selected-only"
        defaultValue={3}
        IconContainerComponent={IconContainer}
        getLabelText={(value) => customIcons[value].label}
        highlightSelectedOnly
        onChange={handleMoodChange}
      />  
      <br></br><br></br>
      <Button   
      onClick={() => {
      handleSubmit();
     }} 
     variant="contained" style={{justifyContent: 'center'}}> Submit </Button>
    </div>

  );
}
