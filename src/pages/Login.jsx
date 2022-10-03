import React from 'react';

// For PrimeReact UI
import { MultiSelect} from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 

const Login = (props) => {
    const { email, setEmail, password, setPassword, handleLogin,
        handleSignup, hasAccount, setHasAccount, emailError, passwordError } = props;

    return (
        <div>
            <div style={{height:'200px'}}></div>
            <div style={{display: 'flex', alignItems: ' center', justifyContent:'center'}}>
            <Card style={{width:'50%'}}>
                <div align= "middle"><img src="/static/images/dark_daily_notion.png" width="150" height="150" alt="My_Logo"/></div>
                <br></br>
                <label>Username </label>
                <InputText 
                    type="text"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className = "errorMsg">{emailError}</p>

                <br></br>
                <label>Password </label>
                <InputText 
                    type="password"
                    required
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />
                    <p className="errorMsg">{passwordError}</p>
                    <br></br>
                    <div className="btnContainer">
                    
                        {hasAccount ?(
                            <>
                            <Button style={{width: '90px'}} onClick={handleLogin}>Sign in</Button>
                            <br></br><br></br>
                            <p>Don't have account? <span style={{fontWeight: 'bold'}} onClick={() =>setHasAccount(!hasAccount)}>Sign up</span></p>
                            </>
                        ) : (
                            <>
                            <Button style={{width: '90px'}} onClick={handleSignup}>Sign up</Button>
                            <br></br><br></br>
                            <p>Have an account? <span  style={{fontWeight: 'bold'}} onClick={()=>setHasAccount(!hasAccount)}>Sign in</span></p>
                            </>
                        )}
                    </div>
            </Card>
            </div>
        </div>
    )
}

export default Login;