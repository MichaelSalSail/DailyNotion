import React from 'react'
import { Link } from 'react-router-dom'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';


// This page is 3 images and some text.
// Logout button doesn't work.
const Main = ({handleLogout, user, email}) =>{
    return(
        <div className="main">
            <nav>
                <Link to="/"><img src="/static/images/logo.png" width="150" height="150" alt="My_Logo"/></Link>
                <div className="dropdown">
                    <img src="/static/images/profileIcon.png" width="150" height="150" alt="profileIcon"/>
                    <div className="dropdown-content">
                        <button className="dropdown-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
            <div>
                <h1 class = "heading">
                Welcome
                <p>Idk this is home</p>
                </h1>
            </div>
            <div>
                <img class = "landing-img" src = "/static/images/productivity.png"/>
            </div>
            <div className = "paragraph">
                <p><strong>
                Hi
                </strong></p>
                
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
                </ButtonGroup>
            </div>
            <div class = "footer">
                <br/>
                <p>CuratedProductivity</p>
                <p> Copyright CuratedProductivity Inc 2022. All Rights Reserved.</p>
            </div>
        </div>
    );
};      
export default Main;