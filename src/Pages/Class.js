import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';
import Cookies from 'universal-cookie';

function SchoolClass() {
    const [Enrollments, setEnrollments] = useState(null);
    const [loading, setloading] = useState(true);
    const [hideButton, setHideButton] = useState(false);
    const [results, setResults] = useState([]);
    const [classObject, setClassObject] = useState(null);
    const [takingAttendance, setTakingAttendance] = useState(false);
    const [classPeriods, setClassPeriods] = useState([]);

    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');

    const cookies = new Cookies();
    var currentToken = cookies.get('JWT_Token');
    var tokenClaims = Operations.GetJWTPayload(currentToken);//gets jwt payload section and decrypts it and turns into json object
    var UserRole = tokenClaims["Role"];

    //UseEffect to get classes students and class info upon first render
    useEffect(() => {
        const daysLower = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('id');
        ApiOperations.GetClassesStudents(classId).then((response) => {
            setEnrollments(response);
            setloading(false);
        })
        ApiOperations.Get("SchoolClasses/"+classId+'/false').then((response) => {
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

    function search(searchString) {
        ApiOperations.Get('User/GetStudents').then((data) => {
            let filteredData = data.filter((element) => (element.firstName + " " + element.lastName).toUpperCase().includes(searchString.trim().toUpperCase()));
            setResults(filteredData);
        });
    }

    //Function to handle adding student fomr - only admins have access to this
    function addStudent(studentId, studentFullName) {
        var Enrollment = {
            "enrollmentId": Operations.generateGuid(),
            "studentId": studentId,
            "classId": classId,
            "studentName": studentFullName
        }
        ApiOperations.Post(Enrollment, 'Enrollments').then((response) => {
            ApiOperations.GetClassesStudents(classId).then((response) => {
                setEnrollments(response);
            })
        });
    }

    //Function to handle roll submission
    function AttendanceSubmit(e){
        e.preventDefault();
        var studentsAttendace = e.target.studentsAttendance;
        var dateValue = Operations.GetDateDbFormatNoTime();
        for (let i = 0; i < studentsAttendace.length; i++) {
            let thisAttendancevalue = studentsAttendace[i].value;
            let attendanceObject;
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
    }  
    
    return (
    <div className="App">
        {
        classObject != null ? 
        <div className="ClassInfo">
            {classObject[0].className} {classObject[0].teacherId}
        </div>
        :
        null
        }
        <button onClick={() => setTakingAttendance(true)}>Take Attendance</button>
        {
            UserRole === "0" ?
            <div>
            <h3 onClick={() => setHideButton(true)} className={hideButton ? 'hidden' : ''}>Assign students to class</h3>
            <input type="text" className={hideButton ? '' : 'hidden'} name="searchString" id="searchString" onChange={(event) => { event.preventDefault(); search(event.target.value); }} />
            {
                results.map((result) => {
                    return(
                    <div>
                        <span>{result.firstName} {result.lastName}</span>
                        <span className="spanLink" onClick={() => addStudent(result.id, result.firstName +" "+ result.lastName)}>add student</span>
                    </div>
                    );
                })
            }
            </div>
            :
            null
        }
        
        
        {
        loading ? <div className="spinner-border" role="status"></div>:
            <form onSubmit={(e) => AttendanceSubmit(e)}>
            {
                takingAttendance ? 
                <select name="ClassPeriod" id="ClassPeriod">
                    {
                        classPeriods.map((period) => {
                            return(
                                <option key={period.id} value={period.id}>{period.dayId} {period.periodId}</option>
                            );
                        })    
                    }
                </select>
                : 
                null
            } 
            {
            Enrollments == null || Enrollments === [] ? "No Students" : Enrollments.map(student => {
            return (
                <div className='RollStudent' key={student.enrollmentId}>
                    <h2>{student.studentName}</h2>
                    {
                    takingAttendance ? 
                    <select name="studentsAttendance" id={student.studentId}>
                        <option value="present">In class</option>
                        <option value="absent">Not in class</option>
                        <option value="presentLate">Late</option>
                    </select> 
                    : null
                    } 
                </div>
            )})
            }
            {
            takingAttendance ? <input type='submit' value='Submit Roll' /> : null
            } 
            </form>
        }
    </div>
  );
}

export default SchoolClass;
