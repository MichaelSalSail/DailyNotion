import React from 'react';

// For PrimeReact UI
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// For Accessing fireDB
import fireDB from '../fire.js';


  export default function Settings() {
    const [ProjectPage_Token, setProjectPage_Token] = React.useState('');
    const [ProjectIntegration_Token, setProjectIntegration_Token] = React.useState('');
    
    const [TemplateIntegration_Token, SetTemplateIntegration_Token] = React.useState('');
    const [TemplateDatabase_Token, setTemplateDatabase_Token] = React.useState('');
    

    // Project Page Token
    function handleProjectPage() {
        console.log("ProjectPage: " + ProjectPage_Token)    
        fireDB.WriteProject_PT(ProjectPage_Token)
    }  
  
    // Project Page Token
    function handleProjectIntegration() {
        console.log("ProjectIntegration: " + ProjectIntegration_Token)  
        fireDB.WriteProject_IT(ProjectIntegration_Token)  
    }  
    
    // Project Page Token
    function handleTemplateIntegration() {
        console.log("TemplateIntegration: " + TemplateIntegration_Token) 
        fireDB.WriteTemplate_IT(TemplateIntegration_Token)   
    }  

    // Project Page Token
    function handleTemplateDatabase() {
        console.log("TemplateDatabase: " + TemplateDatabase_Token)    
        fireDB.WriteTemplate_PT(TemplateDatabase_Token)
    }  

    function TemplateInfoCollapse(){
        const templateLink = React.useState(fireDB.getTemplateLink());
        const [open, setOpen] = React.useState(false);
        const handleClick = () => {
            setOpen(!open);
          };

          //console.log(templateLink[0])
        return (
          
              <div>
                <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader">

                <ListItemButton onClick={handleClick}>
                    <ListItemText> <h1> Notion API Templates </h1> </ListItemText>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                            <div>
                            <p> Hey! Based off your preferences, we recommend you to duplicate the following Notion Template below:</p>
                            <br></br>
                            <a href={templateLink[0]}> Notion Template API </a>
                            <br></br><br></br>
                            <p> In order for our DailyNotion API to work, we need the token values for both your project notion page, and the template page above.</p> 
                            </div>
                    </List>
                </Collapse>

                </List>
              </div>

        );
    }

    // in retrospect, using <span> for inline might been better
    return (
      <div> 

            <h1> Settings </h1>
            <br></br>
            <Card>
                 <div >
                    <TemplateInfoCollapse></TemplateInfoCollapse>
                </div>
            </Card>
            <br></br><br></br><br></br>

            <Card margin='50%' >
                 <div >
                <h3> Project Page Token </h3>
                <br></br>
                <InputText value={ProjectPage_Token} onChange={(e) => setProjectPage_Token(e.target.value)} />
                
                <Button style={{float:'inline', marginLeft:'10px' , width:'80px'}} onClick={() => {
                        handleProjectPage();
                    }} 
                    variant="contained">Update</Button>
                </div>
                <br></br><br></br>
                <div >
                <h3> Project Integration Token </h3>
                <br></br>
                <InputText value={ProjectIntegration_Token} onChange={(e) => setProjectIntegration_Token(e.target.value)} />
                
                <Button style={{float:'inline', marginLeft:'10px' , width:'80px'}} onClick={() => {
                        handleProjectIntegration();
                    }} 
                    variant="contained">Update</Button>
                </div>
                <br></br>
                
            </Card>
            <br></br><br></br><br></br>
            <Card>
            <div >
                <h3> Template Integration Token </h3>
                <br></br>
                <InputText value={TemplateIntegration_Token} onChange={(e) => SetTemplateIntegration_Token(e.target.value)} />
                
                <Button style={{float:'inline', marginLeft:'10px' , width:'80px'}} onClick={() => {
                        handleTemplateIntegration();
                    }} 
                    variant="contained">Update</Button>
                </div>
                <br></br><br></br>
                <div >
                <h3> Template Database Token </h3>
                <br></br>
                <InputText value={TemplateDatabase_Token} onChange={(e) => setTemplateDatabase_Token(e.target.value)} />
                
                <Button style={{float:'inline', marginLeft:'10px' , width:'80px'}} onClick={() => {
                        handleTemplateDatabase();
                    }} 
                    variant="contained">Update</Button>
                </div>

            </Card>
      </div>
  
    );
  }
  