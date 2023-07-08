import '../App.css';
import { useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import AdminCreationForm from './AdminCreationForm';

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
                setStepError(null);
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
                setStepError(null);
            break;
            case 3:
            var periodArray = [];
                if(everyDaySameBool){
                    if(document.getElementById('everydayNumOfPeriods').value === ""){
                        setStepError("please enter a value");
                        break
                    }
                    if(document.getElementById('everydayNumOfPeriods').value < 3){
                        setStepError("must have atleast 3 periods in a day");
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
                        if(document.getElementById(daysOfSchoolWeek[i] + 'NumOfPeriods').value < 3 ) {
                            setStepError("must have atleast 3 periods in a day");
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
                setStepError(null);
            break;
            case 4:
                setFormStep(5);
                setStepError(null);
            break;
        default:
            break;
        }
    };
    
    
    function formSubmit(){
        console.log("Submit");
        var sameEveryday = document.getElementById('everyDaySameBool').checked;
        if(sameEveryday){
            let periodsIdArray = [];
            let everydayNumOfPeriods = document.getElementById('everydayNumOfPeriods').value;
            let breakCount = 0;

            for(let i = 1; i <= everydayNumOfPeriods; i++){
                console.log(i);
                let periodStart = document.getElementById('everydayPeriodStart' + i.toString()).value;
                let periodEnd = document.getElementById('everydayPeriodEnd' + i.toString()).value;
                let isABreak = document.getElementById('everydayIsBreakBool' + i.toString()).checked;
                if(isABreak){
                    breakCount++;
                }
                let thisPeriodsId = Operations.generateGuid();
                periodsIdArray.push(thisPeriodsId);

                let tempPeriodObject = {
                    "id": thisPeriodsId, //temp guid - backend always creates new guid
                    "isABreak": isABreak,
                    "periodNumber": i,
                    "name": isABreak ? "Break" : "Period " + (i - breakCount) ,
                    "periodStartTime": Operations.ConvertTimeFormatForDB(periodStart),
                    "periodEndTime": Operations.ConvertTimeFormatForDB(periodEnd)
                }
                //post period to db
                ApiOperations.CreatePeriod(tempPeriodObject).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }

            var weeksIdArray = [];
            for(let d = 0; d < daysOfSchoolWeek.length; d++){
                let thisDaysId = Operations.generateGuid();
                weeksIdArray.push(thisDaysId);
                let tempDayObject = {
                    "id": thisDaysId,
                    "day": d,
                    "numberOfPeriods": everydayNumOfPeriods,
                    "daysPeriodsJsonArrayString": JSON.stringify(periodsIdArray)
                };
                //post day to db
                ApiOperations.CreateDay(tempDayObject).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }

            let tempWeekObject = {
                "id": Operations.generateGuid(),
                "sameEveryDay": sameEveryday,
                "dailyScheduleJsonArrayString": JSON.stringify(weeksIdArray)
            };
            //post week to db
            ApiOperations.CreateWeek(tempWeekObject).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });


        }else{
            let daysIdArray = [];
            
            for(let d = 0; d < daysOfSchoolWeek.length; d++){
                let breakCount = 0;
                let thisDaysId = Operations.generateGuid();
                daysIdArray.push(thisDaysId);
                let thisDaysNumOfPeriods = document.getElementById(daysOfSchoolWeek[d] + 'NumOfPeriods').value;
                let thisDaysPeriodsIdArray = [];
                for(let i = 1; i <= thisDaysNumOfPeriods; i++){
                    let periodStart = document.getElementById(daysOfSchoolWeek[d] + 'PeriodStart' + i.toString()).value;
                    let periodEnd = document.getElementById(daysOfSchoolWeek[d] + 'PeriodEnd' + i.toString()).value;
                    let isABreak = document.getElementById(daysOfSchoolWeek[d] + 'IsBreakBool' + i.toString()).checked;
                    if(isABreak){
                        breakCount++;
                    }
                    let thisPeriodsId = Operations.generateGuid();
                    thisDaysPeriodsIdArray.push(thisPeriodsId);
                    let tempPeriodObject = {
                        "id": thisPeriodsId, //temp guid - backend always creates new guid
                        "isABreak": isABreak,
                        "periodNumber": i,
                        "name": isABreak ? "Break" : "Period " + (i - breakCount) ,
                        "periodStartTime": Operations.ConvertTimeFormatForDB(periodStart),
                        "periodEndTime": Operations.ConvertTimeFormatForDB(periodEnd)
                    }
                    //post period to db
                    ApiOperations.CreatePeriod(tempPeriodObject).then((res) => {
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                let tempDayObject = {
                    "id": thisDaysId,
                    "day": d,
                    "numberOfPeriods": thisDaysNumOfPeriods,
                    "daysPeriodsJsonArrayString": JSON.stringify(thisDaysPeriodsIdArray)
                };
                //post day to db
                ApiOperations.CreateDay(tempDayObject).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }
            let tempWeekObject = {
                "id": Operations.generateGuid(),
                "sameEveryDay": sameEveryday,
                "dailyScheduleJsonArrayString": JSON.stringify(daysIdArray)
            };
            //post week to db
            ApiOperations.CreateWeek(tempWeekObject).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });

        }
        NextStep(4);
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
                    <div className='flexRow'>
                        <label>Is every day the same schedule?</label>
                        <input type='checkbox' id='everyDaySameBool' name='everyDaySameBool' value='false' ></input>
                    </div>
                    <span className='spanButton btn btn-success' onClick={() => NextStep(1)} >Next</span>
                </div>
                <div className={formStep !== 2 ? 'hidden' : 'formStep2'}>
                    <h3>Set the days start and end times</h3>
                    {
                      step2  
                    }
                    <h5 className='redText mt-10 mb-10'>{stepError !== null ? stepError : ""}</h5>
                    <span className='spanButton btn btn-success' onClick={() => NextStep(2)} >Next</span>
                </div>
                <div className={formStep !== 3 ? 'hidden' : 'formStep3'}>
                    <h3>Set the number of periods including breaks as periods</h3>
                    {
                      step3  
                    }
                    <h5 className='redText mt-10 mb-10' >{stepError !== null ? stepError : ""}</h5>
                    <span className='spanButton btn btn-success' onClick={() => NextStep(3)} >Next</span>
                </div>
                <div className={formStep !== 4 ? 'hidden' : 'formStep4'}>
                    <h3>Set period times and specify if period is actually a break</h3>
                    {
                      step4  
                    }
                    <h5 className='redText mt-10 mb-10' >{stepError !== null ? stepError : ""}</h5>
                    <button id="finalButton" className='btn btn-success'  onClick={() => formSubmit()}  >Submit</button>
                </div>
                
                
            </form>
            <div className={formStep !== 5 ? 'hidden' : 'formStep5'}>
                    <h1>Successfully Created the schools timetable</h1>
                    <h2>Please Now Create A Admin account ( This login will be the highest level admin account)</h2>
                    <AdminCreationForm />
            </div>
        </div>
    );
};

export default SchoolWeekCreator;