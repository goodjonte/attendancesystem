import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Pages/Login';
import Setup from './Pages/Setup';
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
import * as ApiOperations from './Operations/ApiOperations';
import UserProfile from './Pages/UserProfile';
import NoticesPage from './Pages/NoticesPage';
import AbsencesPage from './Pages/AbsencesPage';
import AdminActionsPage from './Pages/AdminActionsPage';


const cookies = new Cookies();
var currentToken = cookies.get('JWT_Token');
var loggedIn;
var UserRole;

ApiOperations.DatabaseTest().then((isDataBool) => {
  
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
          <Route path="/" element={isDataBool ? loggedIn ? UserRole === "0" ? <AdminHome /> : <TeacherHome /> : <Login /> : <Setup />}/>
          <Route path="/class" element={<SchoolClass />}/>
          <Route path="/user" element={<UserProfile />}/>
          <Route path="/notices" element={<NoticesPage />}/>
          <Route path="/absences" element={<AbsencesPage />}/>
          <Route path="/adminaction" element={<AdminActionsPage />}/>
        </Routes>
    </Router>
  );

});
