import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Pages/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
var jwt = cookies.get('JWT_Token');
var loggedIn;
if (jwt){
  loggedIn = true;
}else{
  loggedIn = false;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <App /> : <Login />}/>
      </Routes>
  </Router>
);