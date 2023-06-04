import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Login from './Pages/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Cookies from 'universal-cookie';
import AdminHome from './Pages/AdminHome';
import TeacherHome from './Pages/TeacherHome';


const cookies = new Cookies();
var currentToken = cookies.get('JWT_Token');
var loggedIn;
var UserRole;
if (currentToken){
  loggedIn = true;
  let tokenClaims = JSON.parse(atob(currentToken.split(".")[1]));//gets jwt payload section and decrypts it and turns into json object
  console.log(tokenClaims);
  UserRole = tokenClaims["Role"];
}else{
  loggedIn = false;
  UserRole = null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
        <Route path="/" element={loggedIn ? UserRole === "0" ? <AdminHome /> : <TeacherHome /> : <Login />}/>
      </Routes>
  </Router>
);