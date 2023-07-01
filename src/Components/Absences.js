import React, { useState, useEffect } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import PDF from '../Assets/Attendance-code.pdf';
import Loading from './Loading';

export default function Absences(props){
    const [absences, setAbsences] = useState([]);
    const [absenceValidationMessage, setAbsenceValidationMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const displayAsPage = props.displayAsPage; //If true, display as page, if false, display as component

    //UseEffect to get absences from database upon first render, then sets loading to false
    useEffect(() => {
        ApiOperations.GetAbsences().then(abs => {
            console.log(abs);
            setAbsences(abs);
            setLoading(false);
        });
    }, []);

    //Function with switch statement to convert enum value to string
    function EnumToString(enumValue){
        switch(enumValue){
            case 0:
                return "Present";
            case 1:
                return "Justified";
            case 2:
                return "Unjustified";
            case 3:
                return "OverseasJustified";
            default:
                return "Unknown";
        }
    }

    //Function to handle form submission of absent student
    function changeAttendanceStatus(e, absenceObject){
        e.preventDefault();
        var attendanceStatusSelected = e.target.status.value;
        if(attendanceStatusSelected === "unselected"){
            setAbsenceValidationMessage("Please select a truancy code");
            return;
        }
        absenceObject.status = parseInt(attendanceStatusSelected);
        console.log(absenceObject);
        ApiOperations.ResolveAbsence(absenceObject).then(res => {
            console.log(res);
            if(res === "Success"){
                ApiOperations.GetAbsences().then(abs => {
                    setAbsences(abs);
                });
            }else{
                setAbsenceValidationMessage("Something went wrong, please try again");
            }
        });
    }
    
    return (
      <div className={displayAsPage ? "AbsenceMain" :"Absence"}>
        <div className="AbsencesHeader">
            <h1>Absences</h1>
            <div><a href={PDF} target="_blank" rel="noreferrer">View Attendace Code</a></div>
        </div>
        <div className='AbsencesBox'>
        {loading ? 
            <Loading />
            : 
            <div className={displayAsPage ? 'AbsencesMain overflow-auto' : 'Absences overflow-auto'}>

                
                
                <label id="absenceValidation">{absenceValidationMessage}</label>
                {
                    absences.length === 0 ? <h2>All absences have been resolved</h2> :

                    absences.map(abs => {
                        return (
                            <div className='Absent' key={abs.attendanceId}>
                                <div className='AbsentLeftText'>
                                    <h5>Student: <a className='colorTeal' href={"/user?id="+abs.studentId}>{abs.studentName}</a></h5>
                                    <h5>Class: {abs.className}</h5>
                                </div>
                                <p className='WasMarked'>
                                    Student was marked - {EnumToString(abs.status)}
                                </p>
                                <form className='absentForm' onSubmit={(e) => changeAttendanceStatus(e, abs)}>
                                    <div className="input-group truancyDropdown">
                                        <span className="input-group-text" id="inputGroup-sizing-default">
                                        Truancy:
                                        </span>
                                        <select className="custom-select" name="status">
                                        <option value="unselected">Select Truancy Code...</option>
                                            <option value="0">Present</option>
                                            <option value="1">Justified</option>
                                            <option value="2">Unjustified</option>
                                            <option value="3">Overseas Justified</option>
                                        </select>
                                    </div>
                                    
                                    <button className='btn btn-success absentSubmit' type="submit" value="Submit">Resolve Absence</button>
                                </form>
                            </div>
                        )
                    })
                }
           
            </div>
        }
        </div>
      </div>
    );
}