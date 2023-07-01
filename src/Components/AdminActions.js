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

    //Use effect that checks if there is a predetermined form to show, used when user clicks on a action from navbar
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

    //Call for custom timetable to be created and set 
    useEffect(() => { 
      CreateTimeTable().then((table) => {
        setTimeTable(table);
      });// eslint-disable-next-line
    }, []);

    //Function is called when the user submits the "Create a Student" or "Create a Teacher" form
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
          ClearForms();
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
          ClearForms();
          break;
        default:
          console.log("unknown user type");
          break;
      }
    }

    //Function that calss the correct form to be shown
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

    //Function that creates a class from the data given - called when "Create a class" is submitted
    function CreateClass(e) {
      e.preventDefault();
      if(e.target.classesName.value === ""){
        setCreateClassErrorMessage("Please enter a class name");
        return;
      }
      if(e.target.teacher.value === "none"){
        setCreateClassErrorMessage("Please select a teacher");
        return;
      }
      var allTableDs = document.getElementsByTagName("td");
      var results = [];
      for(var x=0;x<allTableDs.length;x++)
          if(allTableDs[x].style.backgroundColor === "rgb(0, 173, 181)")
              results.push(allTableDs[x]);
      console.log(results);
      if(results.length === 0){
        setCreateClassErrorMessage("Please select at least one period");
        return;
      }
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
      ClearForms();
      setAdminActionsMessage("Class Created");
      setHideButton(null);
      setValidationMessage(null);
    }

    //Function that sets a list of teachers - called when "Create a class" is selected
    function GetTeachers() {
      ApiOperations.GetTeachers().then((teachers) => {
        setTeachersList(teachers);
      });
    }

    //Called when a period is selected, if the period is already selected it will be unselected
    function periodSelected(periodId) {
      if(periodId.includes("Break")){
        return;
      }
      if(document.getElementById(periodId).style.backgroundColor === "rgb(0, 173, 181)"){
        document.getElementById(periodId).style.backgroundColor = "";
        document.getElementById(periodId).style.color = "";
        document.getElementById(periodId).style.fontWeight = "";
      }else{
        document.getElementById(periodId).style.backgroundColor = "#00adb5";
        document.getElementById(periodId).style.color = "#393E46";
        document.getElementById(periodId).style.fontWeight = "bold";
      }
    }

    //Function that returns a table with the schools structure, shows mon-friday and the periods for each day
    //Each period can be selected and will be highlighted green
    //Selected periods are the periods which the class beiong created in on
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

    //Function that clears form after back button is clicked or a user is created
    function ClearForms(){
      document.getElementById("CreateAStudent").reset();
      document.getElementById("CreateATeacher").reset();
      document.getElementById("CreateClassForm").reset();
      setHideButton(null);
      setValidationMessage(null);
      var allTableDs = document.getElementsByTagName("td");
      var results = [];
      for(var x=0;x<allTableDs.length;x++)
          if(allTableDs[x].style.backgroundColor === "rgb(0, 173, 181)")
              results.push(allTableDs[x]);
      for(var v=0;v<allTableDs.length;v++){
        allTableDs[v].style.backgroundColor = "";
        allTableDs[v].style.color = "";
        allTableDs[v].style.fontWeight = "";
      }
    }

    //Show loading screen if loading bool is true
    if(loading){
      return (
        <Loading />
      )
    }
    //Otherwise show the admin actions
    return (
      <div className={mainPageBool ? "AdminActionsMain" : "AdminActions"}>
          <h3 className={hideButton === null ? 'actionTitle' : 'hidden'}> Admin Actions: </h3>
          <h3 onClick={() => SelectForm("student")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Student</h3>
          <h3 onClick={() => SelectForm("teacher")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Teacher</h3>
          <h3 onClick={() => SelectForm("class")} className={hideButton === null ? 'userTypeSelect' : 'hidden'}> Create a Class</h3>
          <h3 onClick={() => {window.location.href = "/AssignStudents"}} className={hideButton === null ? 'userTypeSelect' : 'hidden'}>Assign Student to a Class</h3>
          <h4 className={adminActionsMessage === null ? 'hidden' : 'formSuccess'} >{adminActionsMessage}</h4>

          <div className={hideButton === 'student' ? 'newUserForm' : 'hidden'}>
            <h2>Add a Student</h2>
            <form id="CreateAStudent" method="post" onSubmit={(e) => CreateUser(e, 2)}>
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
              <div onClick={() => {ClearForms();}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div>
          
          <div id="CreateAUser"  className={hideButton === 'teacher' ? 'newUserForm' : 'hidden'}>
            <h2>Add a Teacher</h2>
            <form id="CreateATeacher" method="post" onSubmit={(e) => CreateUser(e, 1)}>
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
              <div onClick={() => {ClearForms();}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div> 

          <div className={hideButton === 'class' ? 'newClassForm' : 'hidden'}>
            <h2>Add a Class</h2>
            <form id="CreateClassForm" method="post" onSubmit={(e) => CreateClass(e)}>
              <div className="input-group newClassInput">
                <span className="input-group-text" id="inputGroup-sizing-default">Class Name: </span>
                <input type="text" name='classesName' className="form-control" />
              </div>

              <div className="input-group teacherDropdown">
                <span className="input-group-text" id="inputGroup-sizing-default">
                  Teacher:
                </span>
                <select className="custom-select" name="teacher">
                  <option value="none" >Select a Teacher</option>
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
              <h3 className={createClassErrorMessage != null ? "redText" : "hidden"}>{createClassErrorMessage}</h3>
              <button className="btn btn-success wd80mauto mg-top-5px" type='submit' name='submit' >Submit</button>
              <div onClick={() => {ClearForms();}} className="btn btn-danger backButton wd80mauto" >Back</div>
            </form>
          </div> 
          
      </div>
    );
  }
  
  export default AdminActions;
  