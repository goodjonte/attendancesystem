import React, { useEffect, useState } from 'react';
import '../App.css';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';


export default function AssignStudents(props) {
    const [results, setResults] = useState([]);
    const [validation, setValidation] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [classes, setClasses] = useState(null);
    const [mainPage, setMainPage] = useState(false); //if true, then this is the main page, if false, then this is a popup from the class page
    const [classId, setClassId] = useState(props.classId);
    var students;
    const EnrollmentSetter = props.EnrollmentSetter;
    
    //Use effect to get all classes if this is the main page - as a class will need to be selected
    useEffect(() => {
        if(classId === undefined || classId === null || classId === "") { 
            setMainPage(true);
            ApiOperations.Get('SchoolClasses').then((data) => {
                setClasses(data);
            });
        };//eslint-disable-next-line
    }, []);

    //Function which is called when "add student is clicked" - checks if student is already in class and will add them if not
    async function addStudent(studentId, studentFullName) {
        if(mainPage && document.getElementById('classIdDropdown').value === "none") {
            setValidation("Please select a class");
            return;
        }
        students = await ApiOperations.GetClassesStudents(classId);
        for(let i = 0; i < students.length; i++) {
            if(students[i].studentId === studentId) {
                setConfirmation("");
                setValidation("Student already in class");
                return;
            }
        }
        setValidation("");
        var Enrollment = {
            "enrollmentId": Operations.generateGuid(),
            "studentId": studentId,
            "classId": classId,
            "studentName": studentFullName
        }
        ApiOperations.Post(Enrollment, 'Enrollments').then((response) => {
            setConfirmation("Student added to class");
            var conf = document.getElementById('confirmation');
            conf.classList.remove('tealTextAnimation');
            setTimeout(() => {
                conf.classList.add('tealTextAnimation');
            }, 100);
            if(mainPage) return;
            ApiOperations.GetClassesStudents(classId).then((response) => {
                EnrollmentSetter(response);
            })
        });
    }

    //Search function called upon typing in the search bar
    function search(searchString) {
        if(searchString === "") return;
        ApiOperations.Get('User/GetStudents').then((data) => {
            let filteredData = data.filter((element) => (element.firstName + " " + element.lastName).toUpperCase().includes(searchString.trim().toUpperCase()));
            setResults(filteredData);
        });
    }

    return (
        <div className='AssignStudents'>
            <h1 className='assignTitle'>Assign Students to Class</h1>

            <form className={mainPage ? "classesForm" : 'hidden'}>
                
                    <select id="classIdDropdown" className="form-select dropdownAssign" name="classId" onChange={(event) => { setClassId(event.target.value) }}>
                        <option value="none">Select a Class</option>
                        {classes === null ? <option>Loading...</option> :
                            classes.map((schoolClass) => {
                                return(
                                    <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.className}</option>
                                );
                            })
                        }
                    </select>
            </form>

            <p className='mt-10 assignSearchLabel'>Search For Student:</p>
            <input type="text" className='assignSearch' name="searchString" id="searchString" onChange={(event) => { event.preventDefault(); search(event.target.value); }} />
            <h6 className={validation === "" ? 'hidden' : 'redText'}>{validation}</h6>
            <h6 id="confirmation" className={confirmation === "" ? 'hidden' : 'tealText tealTextAnimation'}>{confirmation}</h6>
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