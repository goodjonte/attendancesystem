import '../App.css';
import React from 'react';
import SchoolWeekCreator from '../Components/SchoolWeekCreator';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import NavBar from '../Components/NavBar';

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
            <NavBar InSetup={true}/>
            <div className='setupPanel'>
                <h2> It seems theres no data in your database!</h2>
                <h3>Please setup your school now!</h3>
                
                <form onSubmit={e => SubmitSchool(e)} className={createSchoolWeek ? "hidden" : "setupForm"}>
                    <div className="input-group mb-3 setupIG">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">School Name:</span>
                        </div>
                        <input type="text" className="form-control" id='schoolName' name='schoolName' placeholder='school name...' aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                    </div>
                    <button className="btn btn-success setupSubmit" type='submit' > submit </button>
                </form>

                <div className={createSchoolWeek ? "" : "hidden"}>
                    <SchoolWeekCreator />
                </div>
            </div>
            
        </div>
    )
}