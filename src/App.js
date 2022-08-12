import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Main from './pages/Main';
import Quiz from './pages/Quiz';
import Onboarding from './pages/Onboarding';
import BasicTabs from './pages/components/tabs'
import fire_app from './fire';
import { getAuth, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, onAuthStateChanged, 
         signOut} from "firebase/auth";
const auth = getAuth(fire_app);

const App = () => {
  // If true, display Main.jsx
  // If false, display Login.jsx
  const [user, setUser] = useState('');
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
  };

  // Prevents the user from signing up for 3 cases.
  // Upon success, updates the firebase project.
  const handleSignup = () =>{
    clearError();
      createUserWithEmailAndPassword(auth,email,password)
      .catch(err => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
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
          then imported the file to App.js. I'll do that eventually so it looks neater.*/}
      {user ? (
        <Router>
          <Routes>
            <Route exact path="/" 
                   element={<Main handleLogout={handleLogout} user={user} email={email}/>}/>
          </Routes>
        </Router>
      ):(
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
      )} {
        <Router>
        <Routes>
        <Route exact path="/Quiz" 
                 element={<Quiz/>}/>
        </Routes>
      </Router>

      }
      {
        <Router>
        <Routes>
        <Route exact path="/Onboarding" 
                 element={<Onboarding/>}/>
        </Routes>
      </Router>

      }

{
        <Router>
        <Routes>
        <Route exact path="/Tabs" 
                 element={<BasicTabs/>}/>
        </Routes>
      </Router>

      }
    </div>
  );
};

export default App;
