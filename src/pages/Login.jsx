import React from 'react';

const Login = (props) => {
    const { email, setEmail, password, setPassword, handleLogin,
        handleSignup, hasAccount, setHasAccount, emailError, passwordError } = props;

    return (
        <section className='login'>
            <div className="loginContainer">
                <div align= "middle"><img src="/static/images/logo.png" width="150" height="150" alt="My_Logo"/></div>
                <label>Username</label>
                <input
                    type="text"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className = "errorMsg">{emailError}</p>
                <label>Password</label>
                <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />
                    <p className="errorMsg">{passwordError}</p>
                    <div className="btnContainer">
                        {hasAccount ?(
                            <>
                            <button onClick={handleLogin}>Sign in</button>
                            <p>Don't have account? <span onClick={() =>setHasAccount(!hasAccount)}>Sign up</span></p>
                            </>
                        ) : (
                            <>
                            <button onClick={handleSignup}>Sign up</button>
                            <p>Have an account? <span onClick={()=>setHasAccount(!hasAccount)}>Sign in</span></p>
                            </>
                        )}
                    </div>
            </div>
        </section>
    )
}

export default Login;