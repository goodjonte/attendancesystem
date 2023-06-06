import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Pages/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Cookies from 'universal-cookie';
import AdminHome from './Pages/AdminHome';
import TeacherHome from './Pages/TeacherHome';
import SchoolClass from './Pages/Class';
import * as Operations from './Operations/Operations';


const cookies = new Cookies();
var currentToken = cookies.get('JWT_Token');
var loggedIn;
var UserRole;
if (currentToken){
  loggedIn = true;
  let tokenClaims = Operations.GetJWTPayload(currentToken);//gets jwt payload section and decrypts it and turns into json object
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
        <Route path="/class" element={<SchoolClass />}/>
      </Routes>
  </Router>
);