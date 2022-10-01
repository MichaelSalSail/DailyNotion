import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import './App.css';
import Login from './pages/Login';
import Main from './pages/Main';
import Onboarding from "./pages/Onboarding";

import { getAuth, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, onAuthStateChanged, 
  signOut} from "firebase/auth";
import fireDB from './fire.js';

const auth = getAuth(fireDB.fire_app);

const App = () => {
  // If true, display Main.jsx
  // If false, display Login.jsx
  const [user, setUser] = useState('');

  const [currUser, setCurrUser] = useState('');
  // 5 of the 10 parameters required for the Login function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  // reset values
  const clearInput = () => {
    setEmail('');
    setPassword('');
  }
  const clearError = () =>{
    setEmailError('');
    setPasswordError('');
  }


  // Check if user input matches credentials stored in firebase.
  // If so, go to the Home page (Main.jsx)
  const handleLogin= () =>{
    clearError();
    console.log("handling login..")
      signInWithEmailAndPassword(auth,email,password)
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
      setCurrUser(fireDB.getUserID(email))


/*       if (fireDB.checkOnboarded(fireDB.getUser())){
        return <Navigate to='/Dashboard'/>
      } else {
        return <Navigate to='/Onboarding'/>
      } */
  };

  // Prevents the user from signing up for 3 cases.
  // Upon success, updates the firebase project.
  const handleSignup = () =>{
    clearError();
    createUserWithEmailAndPassword(auth,email,password)
    .catch(err => {
      switch(err.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEmailError(err.message);
          break;
        case "auth/weak-password":
          setPasswordError(err.message);
          break;
      }
    });
    // new entry under node 'Users' in Firebase Realtime
    fireDB.set_new_user(fireDB.user_skeleton,email);
    setCurrUser(fireDB.getUserID(email))
  
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Boolean('') = false
  // Boolean('anything') = true
  const authListener = () => {
    onAuthStateChanged(auth, (user) =>{
      if(user){
        clearInput();
        setUser(user);
        setCurrUser(fireDB.getUserID(user.email));
      }else{
        setUser("");
      }
    });
  };

  // useEffect() defines logic that should execute after a 
  // component has been rendered/re-rendered.
  useEffect(() => {
    authListener();
  }, []);

  
  return(
    <div className="App">
      {/* In my other project, my team created a 'routes.js' to clearly label all web app links
          then imported the file to App.js. I'll do that eventually so it looks neater.
          */}


{user ? (
          fireDB.checkOnboarded(fireDB.getUser()) ? (
            <Router>
                <Routes>
                <Route exact path="/Onboarding" 
                        element={<Navigate to='/Dashboard'/>}/>
                <Route exact path="/Dashboard" 
                        element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
                </Routes>
            </Router>
            ) : (
            <Router>
                <Routes>
                <Route exact path="/" 
                        element={<Navigate to='/Onboarding'/>}/>
                <Route exact path="/Onboarding" 
                        element={<Onboarding handleLogout={handleLogout} user={user} email={email}/>}/>
                <Route exact path="/Dashboard" 
                        element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
                </Routes>
            </Router>
  )
      ) : (
      <Router>
          <Routes>
            <Route exact path="/"
                   element={<Login 
                   email = {email} 
                   setEmail = {setEmail} 
                   password = {password}
                   setPassword = {setPassword}
                   handleLogin = {handleLogin}
                   handleSignup = {handleSignup}
                   hasAccount = {hasAccount}
                   setHasAccount ={setHasAccount}
                   emailError = {emailError}
                   passwordError = {passwordError}/>}/>
          </Routes>
        </Router>
      )}
      
    

{/*         


      <Router>
          <Routes>
          <Route exact path="/" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          </Routes>
      </Router>
      
  {fireDB.checkOnboarded(fireDB.getUser()) ? (
      <Router>
          <Routes>
          <Route exact path="/" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          </Routes>
      </Router>
      ) : (
      <Router>
          <Routes>
          <Route exact path="/" 
                  element={<Onboarding handleLogout={handleLogout} user={user} email={email}/>}/>
          </Routes>
      </Router>
      )}


      {user ? ( // if user is true
        fireDB.checkOnboarded(fireDB.getUser()) ? ( // if onboarded
        <Router>
          <Routes>
          <Route exact path="/" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          <Route exact path="/onboarding" 
                   element={<Navigate to="/"/>}/>
          </Routes>
        </Router> 
        ) : ( // if not onboarded <Route exact path="/" element={<Navigate to="/onboarding"/>}/>  
        <Router>
          <Routes>
          <Route exact path="/" 
                   element={<Navigate to="/onboarding"/>}/>
          <Route exact path="/onboarding" 
                   element={<Onboarding handleLogout={handleLogout} user={user} email={email}/>}/>
          <Route exact path="/done" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          </Routes>
        </Router>) 
        ) : ( // if user is false 
        <Router>
          <Routes>
            <Route exact path="/"
                   element={<Login 
                   email = {email} 
                   setEmail = {setEmail} 
                   password = {password}
                   setPassword = {setPassword}
                   handleLogin = {handleLogin}
                   handleSignup = {handleSignup}
                   hasAccount = {hasAccount}
                   setHasAccount ={setHasAccount}
                   emailError = {emailError}
                   passwordError = {passwordError}/>}/>
          </Routes>
        </Router>

      )}

              <Router>
          <Routes>
          <Route exact path="/Onboarding" 
                   element={<Onboarding handleLogout={handleLogout} user={user} email={email}/>}/>
          <Route exact path="/Dashboard" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          <Route exact path="/"
                   element={<Login 
                   email = {email} 
                   setEmail = {setEmail} 
                   password = {password}
                   setPassword = {setPassword}
                   handleLogin = {handleLogin}
                   handleSignup = {handleSignup}
                   hasAccount = {hasAccount}
                   setHasAccount ={setHasAccount}
                   emailError = {emailError}
                   passwordError = {passwordError}/>}/>
           </Routes>
        </Router>
 */}

    

    </div>
  );
};

export default App;
