import React, { useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';


export default function AssignStudents(props) {
    const [results, setResults] = useState([]);
    const EnrollmentSetter = props.EnrollmentSetter;
    const classId = props.classId;
    var ownPage = false;
    if(classId === undefined || classId === null || classId === "") { ownPage = true;};

    function addStudent(studentId, studentFullName) {
        var Enrollment = {
            "enrollmentId": Operations.generateGuid(),
            "studentId": studentId,
            "classId": classId,
            "studentName": studentFullName
        }
        ApiOperations.Post(Enrollment, 'Enrollments').then((response) => {
            if(ownPage) return;
            ApiOperations.GetClassesStudents(classId).then((response) => {
                EnrollmentSetter(response);
            })
        });
    }

    function search(searchString) {
        ApiOperations.Get('User/GetStudents').then((data) => {
            let filteredData = data.filter((element) => (element.firstName + " " + element.lastName).toUpperCase().includes(searchString.trim().toUpperCase()));
            setResults(filteredData);
        });
    }

    return (
        <div className='AssignStudents'>
            <h1 className='assignTitle'>Assign Students to Class</h1>

            <p className='mt-10'>Search For Student:</p>
            <input type="text" className='assignSearch' name="searchString" id="searchString" onChange={(event) => { event.preventDefault(); search(event.target.value); }} />

            {
                results.map((result) => {
                    return(
                    <div key={result.id} className='student'>
                        <span>{result.firstName} {result.lastName}</span>
                        <span className="spanLink" onClick={() => addStudent(result.id, result.firstName +" "+ result.lastName)}>add student</span>
                    </div>
                    );
                })
            }
            </div>
    );
}