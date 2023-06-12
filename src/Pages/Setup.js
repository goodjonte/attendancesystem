
import '../App.css';
import React from 'react';
import SchoolWeekCreator from '../Components/SchoolWeekCreator';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';


export default function Setup(){

    const [createSchoolWeek, setCreateSchoolWeek] = React.useState(false)

    function SubmitSchool(e) {
        setCreateSchoolWeek(true);
        e.preventDefault()
        let newSchoolObject = {
            "id": Operations.generateGuid(),
            "schoolName": e.target.schoolName.value
        }
        ApiOperations.CreateSchool(newSchoolObject);
    }
    
    return (
        <div className='Page'>
            <h1> It seems theres no data in your database!</h1>
            <h3>Please setup your school now!</h3>
            <h4>if you think you shouldnt be seeing this please contact the I.T. help desk!</h4>
            
            <form onSubmit={e => SubmitSchool(e)} className={createSchoolWeek ? "hidden" : ""}>
                <input type='text' id='schoolName' name='schoolName' placeholder='School Name' required/>
                <button type='submit' > submit </button>
            </form>

            <div className={createSchoolWeek ? "" : "hidden"}>
                <SchoolWeekCreator />
            </div>
            
        </div>
    )
}