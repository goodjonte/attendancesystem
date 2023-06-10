import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';

function SchoolClass() {

    const [Enrollments, setEnrollments] = useState(null);
    const [loading, setloading] = useState(true);
    const [title, setTitle] = useState(null);

    
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('id');
        setTitle(urlParams.get('name'))
        ApiOperations.GetClassesStudents(classId).then((response) => {
            setEnrollments(response);
            setloading(false);
        })
    }, []);
   
    //Make into form with drop down box next to each student with absent, present, unjustified, justified
  return (
    <div className="App">
        {
        title != null ? 
        <div className="ClassInfo">{title}</div>
        :
        null
        }
        {
        loading ? <div class="spinner-border" role="status"></div>:

            Enrollments == null || Enrollments === [] ? "No Students" : Enrollments.map(student => {
            return (
                <div className='RollStudent' key={student.enrollmentId}>
                    <h2>{student.studentName}</h2>
                </div>
            )})

        }
    </div>
  );
}

export default SchoolClass;
