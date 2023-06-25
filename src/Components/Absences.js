import React, { useState, useEffect } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import PDF from '../Assets/Attendance-code.pdf';

export default function Absences(){
    const [absences, setAbsences] = useState([]);
    const [absenceValidationMessage, setAbsenceValidationMessage] = useState("");

    useEffect(() => {
        ApiOperations.GetAbsences().then(abs => {
            console.log(abs);
            setAbsences(abs);
        });
    }, []);

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
                window.location.reload();
            }else{
                setAbsenceValidationMessage("Something went wrong, please try again");
            }
        });
    }
    
    return (
      <div className="Absence">
        <div className="AbsencesHeader">
            <h1>Absences</h1>
            <div><a href={PDF} target="_blank" rel="noreferrer">View Attendace Code</a></div>
        </div>
        <div className='AbsencesBox'>
        <div className='Absences overflow-auto'>
            
            <label id="absenceValidation">{absenceValidationMessage}</label>
            {
                absences.length === 0 ? <h2>All absences have been resolved</h2> :

                absences.map(abs => {
                    return (
                        <div className='Absent' key={abs.attendanceId}>
                            <div className='AbsentLeftText'>
                                <h5>Student: <a href={"/user?id="+abs.studentId}>{abs.studentName}</a></h5>
                                <h5>Class: {abs.className}</h5>
                            </div>
                            <p className='WasMarked'>
                                Student was marked - {EnumToString(abs.status)}
                            </p>
                            <form onSubmit={(e) => changeAttendanceStatus(e, abs)}>
                                <select name="status" id="status">
                                    <option value="unselected">Select a Truancy Code...</option>
                                    <option value="0">Present</option>
                                    <option value="1">Justified</option>
                                    <option value="2">Unjustified</option>
                                    <option value="3">Overseas Justified</option>
                                </select>
                                
                                <button type="submit" value="Submit">Resolve Absence</button>
                            </form>
                        </div>
                    )
                })
            }
        </div>
        </div>
      </div>
    );
}