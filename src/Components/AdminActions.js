import '../App.css';
import { useEffect, useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import Loading from './Loading';

function AdminActions(props) {
    const [hideButton, setHideButton] = useState(null);
    const [teachersList, setTeachersList] = useState(null);
    const [timeTable, setTimeTable] = useState(null);
    const [createClassErrorMessage, setCreateClassErrorMessage] = useState(null);
    const [adminActionsMessage, setAdminActionsMessage] = useState(null);
    const [validationMessage, setValidationMessage] = useState(null);
    const [mainPageBool, setMainPageBool] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const requestedAction = props.action;
      switch(requestedAction) {
        case "none":
          setMainPageBool(true);
          break;
        case "student":
          setHideButton("student");
          setMainPageBool(true);
          break;
        case "teacher":
          setHideButton("teacher");
          setMainPageBool(true);
          break;
        case "class":
          setHideButton("class");
          setMainPageBool(true);
          GetTeachers();
          break;
        default:
          break;
      }
      setLoading(false);
    }, [props.action]);

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
          setHideButton(null);
          setValidationMessage(null);
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
          setHideButton(null);
          setValidationMessage(null);
          break;
        default:
          console.log("unknown user type");
          break;
      }
    }

    function SelectForm(userType) {
      setAdminActionsMessage(null); 
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
      setHideButton(null);
      setValidationMessage(null);
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
          <table id="createClassTimeTable">
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

    
    if(loading){
      return (
        <Loading />
      )
    }
    return (
      <div className={mainPageBool ? "AdminActionsMain" : "AdminActions"}>
          <h3 className={hideButton === null ? 'actionTitle' : 'hidden'}> Admin Actions: </h3>
          <h3 onClick={() => SelectForm("student")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Student</h3>
          <h3 onClick={() => SelectForm("teacher")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Teacher</h3>
          <h3 onClick={() => SelectForm("class")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Class</h3>
          <h4 className={adminActionsMessage === null ? 'hidden' : 'formSuccess'} >{adminActionsMessage}</h4>

          <div className={hideButton === 'student' ? 'newUserForm' : 'hidden'}>
            <h2>Add a Student</h2>
            <form method="post" onSubmit={(e) => CreateUser(e, 2)}>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">First Name: </span>
                <input type="text" name='firstName' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Last Name: </span>
                <input type="text" name='lastName' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Parent Name: </span>
                <input type="text" name='parentName' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Parent Phone: </span>
                <input type="text" name='parentPhone' className="form-control" />
              </div>
              
              <h4 className={validationMessage !== null ? "validationMessage" : ""}>{validationMessage}</h4>
              <button className="btn btn-success wd80mauto" type='submit' name='submit' >Submit</button>
              <div onClick={() => {setHideButton(null); setValidationMessage(null);}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div>
          
          <div className={hideButton === 'teacher' ? 'newUserForm' : 'hidden'}>
            <h2>Add a Teacher</h2>
            <form method="post" onSubmit={(e) => CreateUser(e, 1)}>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">First Name: </span>
                <input type="text" name='firstName' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Last Name: </span>
                <input type="text" name='lastName' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Email: </span>
                <input type="text" name='email' className="form-control" />
              </div>
              <div className="input-group newUserInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Password: </span>
                <input type="text" name='password' className="form-control" />
              </div>
              
              <h4 className={validationMessage !== null ? "validationMessage" : ""}>{validationMessage}</h4>
              <button className="btn btn-success wd80mauto" type='submit' name='submit' >Submit</button>
              <div onClick={() => {setHideButton(null); setValidationMessage(null);}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div> 

          <div className={hideButton === 'class' ? 'newClassForm' : 'hidden'}>
            <h2>Add a Class</h2>
            <form method="post" onSubmit={(e) => CreateClass(e)}>
              <div className="input-group newClassInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Class Name: </span>
                <input type="text" name='classesName' className="form-control" />
              </div>

              <div className="input-group teacherDropdown">
                <span className="input-group-text" id="inputGroup-sizing-default">
                  Teacher:
                </span>
                <select className="custom-select" name="teacher">
                  {teachersList != null ?
                    teachersList.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                      ))
                    :
                    ""
                  }
                </select>
              </div>

              <div>
                <h5>Select periods which class is on</h5>
                {
                  timeTable !== undefined ? timeTable : ""
                }
              </div>
              <h3 className={createClassErrorMessage != null ? "" : "hidden"}>{createClassErrorMessage}</h3>
              <button className="btn btn-success wd80mauto mg-top-5px" type='submit' name='submit' >Submit</button>
              <div onClick={() => {setHideButton(null); setValidationMessage(null);}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div> 
          
      </div>
    );
  }
  
  export default AdminActions;
  