import '../App.css';
import { useEffect, useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';

function AdminActions() {
    const [hideButton, setHideButton] = useState(null);
    const [teachersList, setTeachersList] = useState(null);
    const [timeTable, setTimeTable] = useState(null);
    const [createClassErrorMessage, setCreateClassErrorMessage] = useState(null);
    const [adminActionsMessage, setAdminActionsMessage] = useState(null);
    const [validationMessage, setValidationMessage] = useState(null);

    function CreateUser(e, userType){
      e.preventDefault();
      switch (userType) {
        case 1://teacher
          if(e.target.password.value === "" || e.target.email.value === "" || e.target.firstName.value === "" || e.target.lastName.value === ""){
            setValidationMessage("Please fill out all fields");
            return;
          }
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
          setAdminActionsMessage("Teacher Added");
          break;
        case 2://student
          if(e.target.parentName.value === "" || e.target.parentPhone.value === "" || e.target.firstName.value === "" || e.target.lastName.value === ""){
            setValidationMessage("Please fill out all fields");
            return;
          }
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
          setAdminActionsMessage("Student Added");
          break;
        default:
          console.log("unknown user type");
          break;
      }
    }

    function SelectForm(userType) {
      switch(userType) {
        case "student":
          setHideButton("student");
          break;
        case "teacher":
          setHideButton("teacher");
          break;
        case "class":
          setHideButton("class");
          GetTeachers();
          break;
        default:
          break;
      }
    }
    //User Object
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
    //Class Object
    // {
    //   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   "teacherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   "className": "string"
    // }
    function CreateClass(e) {
      e.preventDefault();
      if(e.target.classesName.value === ""){
        setCreateClassErrorMessage("Please enter a class name");
        return;
      }
      var allTableDs = document.getElementsByTagName("td");
      var results = [];
      for(var x=0;x<allTableDs.length;x++)
          if(allTableDs[x].style.backgroundColor === "lightgreen")
              results.push(allTableDs[x]);
      console.log(results);

      var classId = Operations.generateGuid();

      let createClassObject = {
        "id": classId,
        "teacherId": e.target.teacher.value,
        "className": e.target.classesName.value,
      }
      ApiOperations.CreateClass(createClassObject);
      console.log(createClassObject);
      for(let i = 0; i < results.length; i++){
        let assignObject = {
          "id": Operations.generateGuid(),
          "classId": classId,
          "periodId": results[i].getAttribute("value"),
          "dayId":  results[i].parentElement.getAttribute("value")
        }
        ApiOperations.AsignClassToPeriod(assignObject);
        console.log(assignObject);
      }
      setAdminActionsMessage("Class Created");
    }
    function GetTeachers() {
      ApiOperations.GetTeachers().then((teachers) => {
        setTeachersList(teachers);
      });
    }

    function periodSelected(periodId) {
      if(periodId.includes("Break")){
        return;
      }
      if(document.getElementById(periodId).style.backgroundColor === "lightgreen"){
        document.getElementById(periodId).style.backgroundColor = "";
      }else{
        document.getElementById(periodId).style.backgroundColor = "lightgreen";
      }
    }

    async function CreateTimeTable(){
      var data = await ApiOperations.Get("SchoolWeeks/TimetableInfo")
        

        return (
          <table>
            <thead>
              <tr>
                <th scope="col">Monday</th>
                <th scope="col">Tuesday</th>
                <th scope="col">Wednesday</th>
                <th scope="col">Thursday</th>
                <th scope="col">Friday</th>
              </tr>
            </thead>
            <tbody className='formTimeTable'>
              <tr value={data.mondayId}>
                {
                    data.mondayColumn.map((period, i)=> (
                        <td value={period.periodId} id={'monday' + period.periodName} onClick={() => periodSelected('monday' + period.periodName)} key={'monday' +period.periodName + i}>
                            {period.periodName}
                        </td>
                    ))
                }
            </tr>
            <tr value={data.tuesdayId}>
                {
                    data.tuesdayColumn.map((period, i)=> (
                        <td value={period.periodId} id={'tuesday' + period.periodName} onClick={() => periodSelected('tuesday' + period.periodName)} key={'tuesday' +period.periodName + i}>
                            {period.periodName}
                        </td>
                    ))
                }
            </tr>
            <tr value={data.wednesdayId}>
                {
                    data.wednesdayColumn.map((period, i)=> (
                        <td value={period.periodId} id={'wednesday' + period.periodName} onClick={() => periodSelected('wednesday' + period.periodName)} key={'wednesday' + period.periodName + i}>
                            {period.periodName}
                        </td>
                    ))
                }
            </tr>
            <tr value={data.thursdayId}>
                {
                    data.thursdayColumn.map((period, i)=> (
                        <td value={period.periodId} id={'thursday' + period.periodName} onClick={() => periodSelected('thursday' + period.periodName)} key={'thursday' + period.periodName + i}>
                            {period.periodName}
                        </td>
                    ))
                }
            </tr>
            <tr value={data.fridayId}>
                {
                    data.fridayColumn.map((period, i)=> (
                        <td value={period.periodId} id={'friday' + period.periodName} onClick={() => periodSelected('friday' + period.periodName)} key={'friday' + period.periodName + i}>
                            {period.periodName}
                        </td>
                    ))
                }
            </tr>
            </tbody>
          </table>
        )
        
    }
    useEffect(() => {
      CreateTimeTable().then((table) => {
        setTimeTable(table);
      });// eslint-disable-next-line
    }, []);

    useEffect(() => {
      setHideButton(null);
      setValidationMessage(null);
    }, [adminActionsMessage]);

    return (
      <div className="AdminActions">
        
          <h3 onClick={() => SelectForm("student")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Student</h3>
          <h3 onClick={() => SelectForm("teacher")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Teacher</h3>
          <h3 onClick={() => SelectForm("class")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a New Class</h3>
          <h4 className={adminActionsMessage === null ? 'hidden' : 'formSuccess'} >{adminActionsMessage}</h4>

          <div className={hideButton === 'student' ? '' : 'hidden'}>
            <form method="post" onSubmit={(e) => CreateUser(e, 2)}>
              <input type='text' name='firstName' placeholder="first name"></input>
              <input type='text' name='lastName' placeholder="last name"></input>

              <input type='text' name='parentName' placeholder="parent name"></input>
              <input type='text' name='parentPhone' placeholder="parent phone"></input>
              
              <h4 className={validationMessage !== null ? "validationMessage" : ""}>{validationMessage}</h4>
              <button type='submit' name='submit' >Submit</button>
            </form>
          </div>
          
          <div className={hideButton === 'teacher' ? '' : 'hidden'}>
            <form method="post" onSubmit={(e) => CreateUser(e, 1)}>
              <input type='text' name='firstName' placeholder="first name"></input>
              <input type='text' name='lastName' placeholder="last name"></input>

              <input type='text' name='email' placeholder="email"></input>
              <input type='password' name='password' placeholder="password"></input>
              
              <h4 className={validationMessage !== null ? "validationMessage" : ""}>{validationMessage}</h4>
              <button type='submit' name='submit' >Submit</button>
            </form>
          </div> 

          <div className={hideButton === 'class' ? '' : 'hidden'}>
            <form method="post" onSubmit={(e) => CreateClass(e)}>

              <label htmlFor="classesName">Classes Name:</label>
              <input type='text' id='classesName' name='classesName' placeholder="class name"></input>

              <label htmlFor="teacher">Select the classes Teacher:</label>
              <select name="teacher" id="teacher">
                {teachersList != null ?
                  teachersList.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                    ))
                  :
                  ""
                }
              </select>

              <div>
                <h1>Select periods which class is on</h1>
                {
                  timeTable !== undefined ? timeTable : ""
                }
              </div>
              <h3 className={createClassErrorMessage != null ? "" : "hidden"}>{createClassErrorMessage}</h3>
              <button type='submit' name='submit' >Submit</button>
            </form>
          </div> 
          
      </div>
    );
  }
  
  export default AdminActions;
  