import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';
import Cookies from 'universal-cookie';
import NavBar from '../Components/NavBar';
import AssignStudents from '../Components/AssignStudents';
import Loading from '../Components/Loading';

function SchoolClass() {
    const [Enrollments, setEnrollments] = useState(null);
    const [loading, setloading] = useState(true);
    const [classObject, setClassObject] = useState(null);
    const [takingAttendance, setTakingAttendance] = useState(false);
    const [classPeriods, setClassPeriods] = useState([]);
    const [attendanceValidation, setAttendanceValidation] = useState("");

    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');

    const cookies = new Cookies();
    var currentToken = cookies.get('JWT_Token');
    var tokenClaims = Operations.GetJWTPayload(currentToken);//gets jwt payload section and decrypts it and turns into json object
    var UserRole = tokenClaims["Role"];

    function enrollmentSetter(data) {
        setEnrollments(data);
    }

    //UseEffect to get classes students and class info upon first render
    useEffect(() => {
        const daysLower = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('id');
        ApiOperations.GetClassesStudents(classId).then((response) => {
            setEnrollments(response);
            setloading(false);
        })
        ApiOperations.Get("SchoolClasses/GetClassInfo/"+classId).then((response) => {
            setClassObject(response);
        })
        ApiOperations.Get("ClassesPeriods/"+classId).then((response) => {
        
            for(let i = 0; i < response.length; i++){
                ApiOperations.Get("SchoolDays/"+response[i].dayId).then((d) => {
                    response[i].dayId = daysLower[d.day];
                });
                ApiOperations.Get("SchoolPeriods/"+response[i].periodId).then((p) => {
                    response[i].periodId = p.name;
                });
            }

            setClassPeriods(response);
        })
    }, []);

    //Function to handle roll submission
    function AttendanceSubmit(e){
        e.preventDefault();
        if(e.target.ClassPeriod.value === "none"){
            setAttendanceValidation("Please select a class period");
            return;
        }
        var studentsAttendace = e.target.studentsAttendance;
        var attendanceObject;
        var dateValue = Operations.GetDateDbFormatNoTime();
        if(studentsAttendace.value === ""){  //"""" means there are multiple students
            for (let i = 0; i < studentsAttendace.length; i++) {
                if(studentsAttendace[i].value === "none"){
                    setAttendanceValidation("Please select an attendance value for all students");
                    return;
                }
            }
            for (let i = 0; i < studentsAttendace.length; i++) {
                let thisAttendancevalue = studentsAttendace[i].value;
                switch (thisAttendancevalue) {
                    case "present":
                        attendanceObject = {
                            "id": Operations.generateGuid(),
                            "studentId": studentsAttendace[i].id,
                            "classId": classId,
                            "classesPeriodId": e.target.ClassPeriod.value,
                            "isPresent": true,
                            "isLate": false,
                            "date": dateValue,
                            "status": 0,
                            "unjustifiedResolved": true,
                        }
                        ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                            console.log(response);
                        });
                        break;
                    case "absent":
                        let absentId = Operations.generateGuid();
                        attendanceObject = {
                            "id": absentId,
                            "studentId": studentsAttendace[i].id,
                            "classId": classId,
                            "classesPeriodId": e.target.ClassPeriod.value,
                            "isPresent": false,
                            "isLate": false,
                            "date": dateValue,
                            "status": 2,
                            "unjustifiedResolved": false,
                        }
                        ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                            console.log(response);
                        });
                        break;
                    case "presentLate":
                        attendanceObject = {
                            "id": Operations.generateGuid(),
                            "studentId": studentsAttendace[i].id,
                            "classId": classId,
                            "classesPeriodId": e.target.ClassPeriod.value,
                            "isPresent": true,
                            "isLate": true,
                            "date": dateValue,
                            "status": 0,
                            "unjustifiedResolved": true,
                        }
                        ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                            console.log(response);
                        });
                        break;
                    default:
                        break;
                }
            }
        }else{
            if(studentsAttendace.value === "none"){
                setAttendanceValidation("Please select an attendance value for all students");
                return;
            }
            switch (studentsAttendace.value) {
                case "present":
                    attendanceObject = {
                        "id": Operations.generateGuid(),
                        "studentId": studentsAttendace.id,
                        "classId": classId,
                        "classesPeriodId": e.target.ClassPeriod.value,
                        "isPresent": true,
                        "isLate": false,
                        "date": dateValue,
                        "status": 0,
                        "unjustifiedResolved": true,
                    }
                    ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                        console.log(response);
                    });
                    break;
                case "absent":
                    let absentId = Operations.generateGuid();
                    attendanceObject = {
                        "id": absentId,
                        "studentId": studentsAttendace.id,
                        "classId": classId,
                        "classesPeriodId": e.target.ClassPeriod.value,
                        "isPresent": false,
                        "isLate": false,
                        "date": dateValue,
                        "status": 2,
                        "unjustifiedResolved": false,
                    }
                    ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                        console.log(response);
                    });
                    break;
                case "presentLate":
                    attendanceObject = {
                        "id": Operations.generateGuid(),
                        "studentId": studentsAttendace.id,
                        "classId": classId,
                        "classesPeriodId": e.target.ClassPeriod.value,
                        "isPresent": true,
                        "isLate": true,
                        "date": dateValue,
                        "status": 0,
                        "unjustifiedResolved": true,
                    }
                    ApiOperations.Post(attendanceObject, 'Attendances').then((response) => {
                        console.log(response);
                    });
                    break;
                default:
                    break;
            }
        }
       
        // window.location.reload();
    }

    function removeStudent(studentId, classId) {
        //eslint-disable-next-line
        if(!confirm("Are you sure you want to delete this user?")) return; //Confirmation of deletion
        ApiOperations.Delete('Enrollments/' + studentId + '/' + classId).then((response) => {
            if(response === "Success"){
                ApiOperations.GetClassesStudents(classId).then((response) => {
                    setEnrollments(response);
                })
            }else{
                console.log(response);
            }
        });
    }
    
    return (
    <div className="App">
        <NavBar userLoggedIn={true}/>
        <div className='classPage'>
        {
        classObject != null ? 
        <div className="ClassInfo">
            <h1>Class: {classObject.className} </h1>
            <h1>Teacher: {classObject.teachersName}</h1>
        </div>
        :
        null
        }
        
        
        {
        loading ? <Loading />:
            <form onSubmit={(e) => AttendanceSubmit(e)}>
                {takingAttendance ? 
        <div onClick={() => setTakingAttendance(false)} className="btn btn-danger mt-10 mb-10" >Back</div> 
        : 
        <button onClick={() => setTakingAttendance(true)} className="btn btn-success mt-10 mb-10">Take Attendance</button>
        } 
            {
                takingAttendance ? 
                <div className="input-group periodDropdown">
                    <span className="input-group-text" id="inputGroup-sizing-default">
                    Period:
                    </span>
                    <select className="custom-select" name="ClassPeriod" id="ClassPeriod">
                        <option value="none" >Select a period...</option>
                        {
                            classPeriods.map((period) => {
                                return(
                                    <option key={period.id} value={period.id}>{period.dayId} {period.periodId}</option>
                                );
                            })    
                        }
                    </select>
                </div>
                : 
                null
            } 
            <div className='studentList'>
            {
            Enrollments == null || Enrollments === [] ? "No Students" : Enrollments.map(student => {
            return (
                <div className='RollStudent' key={student.enrollmentId}>
                    <h2>{student.studentName}</h2>
                    {
                        takingAttendance ? null :
                        UserRole === "0" ?
                        <h6 className='redText underline' onClick={() => {removeStudent(student.studentId, classId)}}>Remove Student</h6>
                        :
                        null
                    }
                    {
                    takingAttendance ? 
                    <select className='attendaceSelectDropdown' name="studentsAttendance" id={student.studentId}>
                        <option value="none">Select...</option>
                        <option value="present">In class</option>
                        <option value="absent">Not in class</option>
                        <option value="presentLate">Late</option>
                    </select> 
                    : null
                    } 
                </div>
            )})
            }
            </div>
            {
            takingAttendance ? 
            <div>
                <h4 className='redText'>{attendanceValidation}</h4>
                <input type='submit' className='btn btn-success rollSubmitButton' value='Submit Roll' /> 
            </div>
            : null
            } 
            </form>
        }
        </div>
        {
            UserRole === "0" ?
            <AssignStudents EnrollmentSetter={enrollmentSetter} classId={classId}/>
            :
            null
        }
    </div>
  );
}

export default SchoolClass;
