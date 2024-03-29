import React from 'react';


// For PrimeReact UI
import { MultiSelect} from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

// For Routing & Accessing fireDB
import fireDB from '../fire.js';
import { Navigate } from 'react-router-dom';

const { useState} = React;

// 'values' are passed to FireDB 
const prod_problems = [
    {label: 'Procrastination', value: 'Procrastination'},
    {label: 'Excessive Task Switching', value: 'Excessive Task Switching'},
    {label: 'Excessive Negative Thinking', value: 'Excessive Negative Thinking'},
    {label: 'Overwork (burnout)', value: 'Overwork (burnout)'}
];

const organizing_skills = [
    {label: 'Terrible', value: '0'},
    {label: 'Needs Some Work', value: '1'},
    {label: 'Okay', value: '2'},
    {label: 'Great', value: '3'},
    {label: 'Perfect', value: '4'},
];

const weekdays = [
    {label: 'Sunday', value: 1},
    {label: 'Monday', value: 2},
    {label: 'Tuesday', value: 3},
    {label: 'Wednesday', value: 4},
    {label: 'Thursday', value: 5},
    {label: 'Friday', value: 6},
    {label: 'Saturday', value: 7}
];

const daytimes = [
    {label: 'Early Morning (6AM-9AM)', value: '0'},
    {label: 'Late Morning (9AM-12PM)', value: '1'},
    {label: 'Early Afternoon (12PM-3PM)', value: '2'},
    {label: 'Late Afternoon (3PM-6PM)', value: '3'},
    {label: 'Early Evening (6PM-9PM)', value: '4'},
    {label: 'Late Evening (9PM-12AM)', value: '5'},
    {label: 'Night (12AM-5AM)', value: '6'}
];


const Onboarding = ({handleLogout, user, email}) =>{

    const [selectedQ1, setQ1] = useState(null)
    const [selectedQ2, setQ2] = useState(null)
    const [selectedQ3, setQ3] = useState(null)
    const [selectedQ4, setQ4] = useState(null)
    const [selectedQ5, setQ5] = useState(null)
    const [toDash, setDash] = useState(false)       // used to Navigate

    const footer = <span>
        <Button label="Submit" onClick={() => {handleSubmit();}} icon="pi pi-check" style={{marginRight: '.25em', width: '20em'}}/>

    </span> 


    function verifyAns(ans){ // verifies if the answers are non-empty
        if (ans.includes(null)){
            return false
        }
        for (let i = 0; i < ans.length; i++){
            if (ans[i].length === 0){
                return false
            } 
        }
        return true
    }

    // Posts to DB, and verifies Onboarding, triggering /Dashboard
    function handleSubmit(){
        let ans = [selectedQ1, selectedQ2, selectedQ3, selectedQ4, selectedQ5]
        //debug()
            
        if (verifyAns(ans)){
            
            fireDB.WriteOnboarding(ans)
            console.log("SUCESS!")
            setDash(true)
        }

    }

    return(
            <div style={{margin:'3%'}}>
            <div style={{width: '60%'}}>
            <Card footer={footer} title="Welcome to DailyNotion!" subTitle="Please answer the questions below to get started">
            <img width='300px' height='300px' alt="happy sun with text below, daily notion" src='/static/images/dark_daily_notion.png'/>
            <h3> 1) What is your most common productivity hurdle? </h3> <br></br>
            <MultiSelect  showSelectAll="false" selectionLimit="1" placeholder="Select One" optionLabel="label" value={selectedQ1} options={prod_problems} onChange={(e) => setQ1(e.value)} />
            <br></br><br></br>
            <h3> 2) How would you describe your organizational ability? </h3> <br></br>
            <MultiSelect  showSelectAll="false" selectionLimit="1" placeholder="Select One" optionLabel="label" value={selectedQ2} options={organizing_skills} onChange={(e) => setQ2(e.value)} />
            <br></br><br></br>
            <h3> 3) Which days of the week are you most productive? (max. 3) </h3> <br></br>
            <MultiSelect display="chip" showSelectAll="false" selectionLimit="3" placeholder="Select 1-3" optionLabel="label" value={selectedQ3} options={weekdays} onChange={(e) => setQ3(e.value)} />
            <br></br><br></br>
            <h3> 4) Which times of day are you most productive? (max. 3) </h3> <br></br>
            <MultiSelect display="chip" showSelectAll="false" selectionLimit="3" placeholder="Select 1-3" optionLabel="label" value={selectedQ4} options={daytimes} onChange={(e) => setQ4(e.value)} />
            <br></br><br></br>
            <h3> 5) Which days of the week are you least productive? (max. 3) </h3> <br></br>
            <MultiSelect display="chip" showSelectAll="false" selectionLimit="3" placeholder="Select 1-3" optionLabel="label" value={selectedQ5} options={weekdays} onChange={(e) => setQ5(e.value)} />
            
            </Card>
            </div>
                {toDash && (
                    <Navigate to="/Dashboard" replace={true} />
                    )}
            </div>


    );
};      
export default Onboarding;