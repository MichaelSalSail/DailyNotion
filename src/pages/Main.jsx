import React from 'react'
import { Link } from 'react-router-dom'
// import logo from '/static/images/logo.png'
// import landingimg from '/static/images/productivity.png'
// import profileIcon from '/static/images/profileIcon.png'


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
                </strong>
                </p>
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