import '../App.css';
import { useState } from 'react';
import * as Operations from '../Operations/Operations';
// import * as ApiOperations from '../Operations/ApiOperations';

//Note Time is given as 24hr clock string value e.g. 5pm is 17:00 and if no input is provided value will be empty string - ""

function SchoolWeekCreator() {

    const [formStep, setFormStep] = useState(1);
    const [step2, setStep2] = useState(null);
    const [step3, setStep3] = useState(null);
    const [step4, setStep4] = useState(null);
    const [stepError, setStepError] = useState(null);

    const daysOfSchoolWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"]

    function NextStep(step) {
        const everyDaySameBool = document.getElementById('everyDaySameBool').checked;

        //step number corrisponds to the step that has been completed
        switch (step) {
            case 1:
                setStep2(Operations.createStep(everyDaySameBool, 2));//Create Step 2 based off of checkbox from step 1
                setFormStep(2);
            break;
            case 2:
                if(everyDaySameBool){
                    if(document.getElementById('everydayEnd').value === "" || document.getElementById('everydayStart').value === "") {
                        setStepError("please enter both a start and end time");
                        break;
                    }
                    if(document.getElementById('everydayEnd').value === document.getElementById('everydayStart').value) {
                        setStepError("please enter different times");
                        break;
                    }
                    if(document.getElementById('everydayEnd').value < document.getElementById('everydayStart').value && document.getElementById('everydayEnd').value !== "") {
                        setStepError("start time must be earlier than end time");
                        break;
                    }
                }else {
                    let wasErr = false;
                    for(let i = 0; i < daysOfSchoolWeek.length; i++) {
                        if(document.getElementById(daysOfSchoolWeek[i] + 'End').value === "" || document.getElementById(daysOfSchoolWeek[i] + 'Start').value === "") {
                            setStepError("please enter both a start and end time for all days");
                            wasErr = true;
                            break;
                        }
                        if(document.getElementById(daysOfSchoolWeek[i] + 'End').value < document.getElementById(daysOfSchoolWeek[i] + 'Start').value && document.getElementById(daysOfSchoolWeek[i] + 'End').value !== "") {
                            setStepError("start time must be earlier than end time");
                            wasErr = true;
                            break;
                        }
                        if(document.getElementById(daysOfSchoolWeek[i] + 'End').value === document.getElementById(daysOfSchoolWeek[i] + 'Start').value) {
                            setStepError("please enter different times");
                            wasErr = true;
                            break;
                        }
                    }
                    if(wasErr){ //breaks out of the function incase theres is an error, that way the next step isnt loaded
                        break;
                    }
                }
                setStep3(Operations.createStep(everyDaySameBool, 3));
                setFormStep(3);
                console.log("no errors");
            break;
            case 3:
            var periodArray = [];
                if(everyDaySameBool){
                    if(document.getElementById('everydayNumOfPeriods').value === ""){
                        setStepError("please enter a value");
                        break
                    }
                }else {
                    let wasErr = false; 
                    for(let i = 0; i < daysOfSchoolWeek.length; i++) {
                        if(document.getElementById(daysOfSchoolWeek[i] + 'NumOfPeriods').value === "") {
                            setStepError("please enter all values");
                            wasErr = true;
                            break;
                        }
                    }
                    if(wasErr){ //breaks out of the function incase theres is an error, that way the next step isnt loaded
                        break;
                    }
                    for(let i = 0; i < daysOfSchoolWeek.length; i++) {
                        periodArray.push([daysOfSchoolWeek[i], document.getElementById(daysOfSchoolWeek[i] + 'NumOfPeriods').value, document.getElementById(daysOfSchoolWeek[i] + 'Start').value, document.getElementById(daysOfSchoolWeek[i] + 'End').value]);
                    }
                }
                setStep4(Operations.CreatePeriodSetterTable(periodArray, everyDaySameBool));
                setFormStep(4);
            break;
        default:
            break;
        }
    };
    
    
    function formSubmit(){
        console.log("Submit");
        
    }
    //Order of getting information that makes most sense:
    //ask if everyday is same schedule
    //get DAY start and end time
    //get number of periods in a day incl breaks
    //set periods start n end times
    return (
        <div className="weekForm">
            <form method='POST' onSubmit={e => {e.preventDefault();} }>
                <div className={formStep !== 1 ? 'hidden' : 'formStep1'}>
                    <label>Is every day the same schedule?</label>
                    <input type='checkbox' id='everyDaySameBool' name='everyDaySameBool' value='false' ></input>
                    <span className='spanButton' onClick={() => NextStep(1)} >Next</span>
                </div>
                <div className={formStep !== 2 ? 'hidden' : 'formStep2'}>
                    <h3>Set the days start and end times</h3>
                    {
                      step2  
                    }
                    <h4>{stepError !== null ? stepError : ""}</h4>
                    <span className='spanButton' onClick={() => NextStep(2)} >Next</span>
                </div>
                <div className={formStep !== 3 ? 'hidden' : 'formStep2'}>
                    <h3>Set the number of periods including breaks as periods</h3>
                    {
                      step3  
                    }
                    <h4>{stepError !== null ? stepError : ""}</h4>
                    <span className='spanButton' onClick={() => NextStep(3)} >Next</span>
                </div>
                <div className={formStep !== 4 ? 'hidden' : 'formStep2'}>
                    <h3>Set period times and specify if period is actually a break</h3>
                    {
                      step4  
                    }
                    <h4>{stepError !== null ? stepError : ""}</h4>
                    <button id="finalButton"  onClick={() => formSubmit()}  >Submit</button>
                </div>
                

                <table className="hidden">
                    <thead>
                        <tr>
                        <th scope="col">Monday</th>
                        <th scope="col">Tuesday</th>
                        <th scope="col">Wednesday</th>
                        <th scope="col">Thursday</th>
                        <th scope="col">Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default SchoolWeekCreator;