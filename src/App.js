import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import fire_app from './fire';
import './App.css';
import Login from './pages/Login';
import Main from './pages/Main';
import "firebase/auth";

const App = () => {
  const [user, setUser] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

const clearInput = () => {
  setEmail('');
  setPassword('');
}

const clearError = () =>{
  setEmailError('');
  setPasswordError('');
}

const handleLogin= () =>{
  clearError();
  fire_app 
    .auth()
    .signInWithEmailAndPassword(email,password)
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
const handleSignup = () =>{
  clearError();
  fire_app 
    .auth()
    .createUserWithEmailAndPassword(email,password)
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
  fire_app.auth().signOut();
  
};




const authListener = () => {
  fire_app.auth().onAuthStateChanged(user =>{
    if(user){
      clearInput();
      setUser(user);
    }else{
      setUser("");
    }
  });
};

useEffect(() => {
  authListener();
}, []);



return(
  
  <div className="App">
 
    {user ? (
      <Router>
        <Route exact path="/">
          <Main handleLogout ={handleLogout } user = {user} email = {email}  />
        </Route>
      </Router>
      
    ):(
      <Router>
        <Login 
        email = {email} 
        setEmail = {setEmail} 
        password = {password}
        setPassword = {setPassword}
        handleLogin = {handleLogin}
        handleSignup = {handleSignup}
        hasAccount = {hasAccount}
        setHasAccount ={setHasAccount}
        emailError = {emailError}
        passwordError = {passwordError}
        />
      </Router>
    )}
  </div>
);
};
export default App;
