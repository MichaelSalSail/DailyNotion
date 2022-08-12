import React from 'react'
import { Link } from 'react-router-dom'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import ResponsiveAppBar from './components/navbar.jsx'
import BasicTabs from './components/tabs.jsx'
import Card from '@mui/material/Card';


// This page is 3 images and some text.
// Logout button doesn't work.
const Onboarding= ({handleLogout, user, email}) =>{
    return(
        <div>
        
         
            <div class = "center-screen ">
            
                <div class = "main">
                    <Card>
                        <BasicTabs> </BasicTabs>
                    </Card>
                    
                </div>
                    
            </div>
            <div class = "footer">
                <br/>
                <p>CuratedProductivity</p>
                <p> Copyright CuratedProductivity Inc 2022. All Rights Reserved.</p>
            </div>
        </div>
    );
};      
export default Onboarding;