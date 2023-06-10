import '../App.css';
import { useState } from 'react';
// import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';

function AdminActions() {

    const [hideButton, setHideButton] = useState(null);

    function CreateUser(e, userType){
      e.preventDefault();
      switch (userType) {
        case 1://teacher
          var teacherObject = {
            "email": e.target.email.value,
            "password": e.target.password.value,
            "firstName": e.target.firstName.value,
            "lastName": e.target.lastName.value,
            "usersRole": 1,
            "parentName": "",
            "parentPhone": ""
          };
          ApiOperations.CreateUser(teacherObject);
          break;
        case 2://student
          var studentObject = {
            "email": "",
            "password": "",
            "firstName": e.target.firstName.value,
            "lastName": e.target.lastName.value,
            "usersRole": 2,
            "parentName": e.target.parentName.value,
            "parentPhone": e.target.parentPhone.value
          };
          ApiOperations.CreateUser(studentObject);
          break;
        default:
          console.log("unknown user type");
          break;
      }
    }

    function SelectedUserType(userType) {
      switch(userType) {
        case "student":
          setHideButton("student");
          break;
        case "teacher":
          setHideButton("teacher");
          break;
        default:
          break;
      }

    }
    // {
    //   "email": "",
    //   "password": "",
    //   "schoolId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   "firstName": "string",
    //   "lastName": "string",
    //   "usersRole": 0,
    //   "parentName": "string",
    //   "parentPhone": "string"
    // }
    function CreateClass() {
      
    }

    return (
      <div className="AdminActions">
        
          <h3 onClick={() => SelectedUserType("student")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Student</h3>
          <h3 onClick={() => SelectedUserType("teacher")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Teacher</h3>
          <h3 onClick={() => CreateClass()} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Class</h3>

          <div className={hideButton === 'student' ? '' : 'hidden'}>
            <form method="post" onSubmit={(e) => CreateUser(e, 2)}>
              <input type='text' name='firstName' placeholder="first name"></input>
              <input type='text' name='lastName' placeholder="last name"></input>

              <input type='text' name='parentName' placeholder="parent name"></input>
              <input type='text' name='parentPhone' placeholder="parent phone"></input>
              
              <button type='submit' name='submit' >Submit</button>
            </form>
          </div>
          
          <div className={hideButton === 'teacher' ? '' : 'hidden'}>
            <form method="post" onSubmit={(e) => CreateUser(e, 1)}>
              <input type='text' name='firstName' placeholder="first name"></input>
              <input type='text' name='lastName' placeholder="last name"></input>

              <input type='text' name='email' placeholder="email"></input>
              <input type='password' name='password' placeholder="password"></input>
              
              <button type='submit' name='submit' >Submit</button>
            </form>
          </div> 

          

        
        
      </div>
    );
  }
  
  export default AdminActions;
  