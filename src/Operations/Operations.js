import { v4 as uuidv4 } from 'uuid';
const daysLower = ["monday","tuesday","wednesday","thursday","friday"]

function GetDateString() {
    const monthStrings = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date();
    return (
        dayStrings[date.getDay()] + ", " + date.getDate()+ " " + monthStrings[date.getMonth()] + " " + date.getFullYear()
    )
}
function GetJWTPayload(jwt) {
    return JSON.parse(atob(jwt.split(".")[1]))
}
function createStep(sameBool, stepNumber) {
    switch (stepNumber) {
        case 2: 
            if(sameBool) {
                return(
                    <div>
                        <label>Start Time:</label>
                        <input type="time" id="everydayStart" name="everydayStart" />
                        <label>End Time:</label>
                        <input type="time" id="everydayEnd" name="everydayEnd" />
                    </div>
                )
            }else {
                return(
                    <table>
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">Monday</th>
                            <th scope="col">Tuesday</th>
                            <th scope="col">Wednesday</th>
                            <th scope="col">Thursday</th>
                            <th scope="col">Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Start Time</th>
                            <td>
                                <input type="time" id="mondayStart" name="mondayStart" />
                            </td>
                            <td>
                                <input type="time" id="tuesdayStart" name="tuesdayStart" />
                            </td>
                            <td>
                                <input type="time" id="wednesdayStart" name="wednesdayStart" />
                            </td>
                            <td>
                                <input type="time" id="thursdayStart" name="thursdayStart" />
                            </td>
                            <td>
                                <input type="time" id="fridayStart" name="fridayStart" />
                            </td>
                            </tr>
                            <tr>
                            <th scope="row">End Time</th>
                            <td>
                                <input type="time" id="mondayEnd" name="mondayEnd" />
                            </td>
                            <td>
                                <input type="time" id="tuesdayEnd" name="tuesdayEnd" />
                            </td>
                            <td>
                                <input type="time" id="wednesdayEnd" name="wednesdayEnd" />
                            </td>
                            <td>
                                <input type="time" id="thursdayEnd" name="thursdayEnd" />
                            </td>
                            <td>
                                <input type="time" id="fridayEnd" name="fridayEnd" />
                            </td>
                            </tr>
                            </tbody>
                    </table>
                )
            }//end of step 2
        case 3:
            if(sameBool) {
                return(
                    <div>
                        <label>Number of periods including breaks:</label>
                        <input type="number" id="everydayNumOfPeriods" name="everydayNumOfPeriods" />
                    </div>
                )
            }else {
                return (
                    <table>
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">Monday</th>
                            <th scope="col">Tuesday</th>
                            <th scope="col">Wednesday</th>
                            <th scope="col">Thursday</th>
                            <th scope="col">Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Periods incl breaks</th>
                            <td>
                                <input type="number" id="mondayNumOfPeriods" name="mondayNumOfPeriods" />
                            </td>
                            <td>
                                <input type="number" id="tuesdayNumOfPeriods" name="tuesdayNumOfPeriods" />
                            </td>
                            <td>
                                <input type="number" id="wednesdayNumOfPeriods" name="wednesdayNumOfPeriods" />
                            </td>
                            <td>
                                <input type="number" id="thursdayNumOfPeriods" name="thursdayNumOfPeriods" />
                            </td>
                            <td>
                                <input type="number" id="fridayNumOfPeriods" name="fridayNumOfPeriods" />
                            </td>
                            </tr>
                            </tbody>
                    </table>
                )
            }
        default:
            break;
    }
};

function setNextTime(periodNumber, dayLowerNumber, everydaySameBool){
    if(everydaySameBool){
        let valueSet = document.getElementById("everydayPeriodEnd"+ periodNumber).value;
        if(valueSet < document.getElementById("everydayPeriodStart"+ periodNumber).value || valueSet > document.getElementById("everydayPeriodEnd"+ periodNumber).max){
            document.getElementById("validity"+ periodNumber).innerText = "Invalid time";
        }else{
            document.getElementById("everydayPeriodStart"+ (periodNumber + 1)).value = valueSet;
            document.getElementById("validity"+ periodNumber).innerText = "";
        }
    }else{
        let valueSet = document.getElementById(daysLower[dayLowerNumber]+ "PeriodEnd"+(periodNumber + 1)).value;
        if(valueSet < document.getElementById(daysLower[dayLowerNumber]+ "PeriodStart"+(periodNumber + 1)).value || valueSet > document.getElementById(daysLower[dayLowerNumber]+ "PeriodEnd"+(periodNumber + 1)).max){
            document.getElementById(daysLower[dayLowerNumber]+ "PeriodValidation"+(periodNumber + 1)).innerText = "Invalid time";
            console.log("Inalid time");
        }else{
            document.getElementById(daysLower[dayLowerNumber]+ "PeriodStart"+(periodNumber + 2)).value = valueSet;
            document.getElementById(daysLower[dayLowerNumber]+ "PeriodValidation"+(periodNumber + 1)).innerText = "";
            console.log("Valid time");
        }
    }
}
function getMaxPeriodsInADay(periodArray) {
    let count = 0;
    for(let i=0; i < periodArray.length; i++){ //get the number of most periods in a day
        if(periodArray[i][1] > count){
            count = periodArray[i][1];
        }
    }
    return count;
}

function CreatePeriodSetterTable(NumberOfPeriodsArray, sameDaysBool){//number of periods array = [ [dayofweek, numberOfPerPeriods, daystart, dayend] , [...]]
    if(sameDaysBool){
        console.log("NumberOfPeriod is same every day");
        let periods = document.getElementById("everydayNumOfPeriods").value;
        let tHead = [];
        let dataRowArray = [];
        let everyDayStart = document.getElementById("everydayStart").value;
        let everyDayEnd = document.getElementById("everydayEnd").value;
        periods++;  
        for(let i = 1; i < periods; i++){
            tHead.push("Period " + i);//loop creates data for title row
        };
        for(let i = 1; i < periods; i++){
            if(i === 1){
                dataRowArray.push(
                    <div className="everydayPeriod">
                        <label htmlFor={"everydayIsBreakBool"+ i } >Is a break?</label>
                        <input type="checkbox" id={"everydayIsBreakBool"+ i } name={"everydayIsBreakBool"+ i } />
                        <label htmlFor={"everydayPeriodStart"+ i } >Period Start:</label>
                        <input type="time" id={"everydayPeriodStart"+ i } name={"everydayPeriodStart"+ i } value={everyDayStart} disabled/>
                        <label htmlFor={"everydayPeriodEnd"+ i } >Period End:</label>
                        <input type="time" onChange={() => setNextTime(i, i, sameDaysBool)} id={"everydayPeriodEnd"+ i } name={"everydayPeriodEnd"+ i } max={everyDayEnd}/>
                        <span className="errorText" id={"validity" + i }></span>
                    </div>
                );
            }else if(i === (periods - 1)){
                dataRowArray.push(
                    <div className="everydayPeriod">
                        <label htmlFor={"everydayIsBreakBool"+ i } >Is a break?</label>
                        <input type="checkbox" id={"everydayIsBreakBool"+ i } name={"everydayIsBreakBool"+ i } />
                        <label htmlFor={"everydayPeriodStart"+ i } >Period Start:</label>
                        <input type="time" id={"everydayPeriodStart"+ i } name={"everydayPeriodStart"+ i } min={everyDayStart} />
                        <label htmlFor={"everydayPeriodEnd"+ i } >Period End:</label>
                        <input type="time" id={"everydayPeriodEnd"+ i } name={"everydayPeriodEnd"+ i } value={everyDayEnd} disabled/>
                        <span className="errorText" id={"validity" + i }></span>
                    </div>
                );
            }else{
                dataRowArray.push(
                    <div className="everydayPeriod">
                        <label htmlFor={"everydayIsBreakBool"+ i } >Is a break?</label>
                        <input type="checkbox" id={"everydayIsBreakBool"+ i } name={"everydayIsBreakBool"+ i } />
                        <label htmlFor={"everydayPeriodStart"+ i } >Period Start:</label>
                        <input type="time" id={"everydayPeriodStart"+ i } name={"everydayPeriodStart"+ i } disabled/>
                        <label htmlFor={"everydayPeriodEnd"+ i } >Period End:</label>
                        <input type="time" onChange={() => setNextTime(i, i, sameDaysBool)} id={"everydayPeriodEnd"+ i } name={"everydayPeriodEnd"+ i } max={everyDayEnd}/>
                        <span className="errorText" id={"validity" + i }></span>
                    </div>
                );
            }
        }


        return(
            <table>
                <thead>
                    <tr>
                        {
                            tHead.map((period, i) => (
                                <th key={i} scope="col">{period}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody >
                    <tr>
                        {
                            dataRowArray.map((data, index)=> (
                                <td key={"everyday"+(index + 1)}>
                                    {data}
                                </td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        )
        
    }else{;

        let mostPeriods = getMaxPeriodsInADay(NumberOfPeriodsArray);
        var firstColumn = [];
        var daysColumns = [];//array holding data to be able to map table columns

        
        
        mostPeriods++;  //Have to add one so last column is shown on screen - if need to use should minus 1 for accurate number
        for(let i = 1; i < mostPeriods; i++){
            firstColumn.push("Period " + i);//loop creates data for first column
        };
        for(let i = 0; i < 5; i++){
            let tempDayArray = [];
            for(let j = 0; j < NumberOfPeriodsArray[i][1]; j++){
                    if(j === 0){
                        tempDayArray.push(
                            
                            <div className="miniPeriodForum">
                                <label htmlFor={daysLower[i]+ "IsBreakBool"+(j + 1)} >Is a break?</label>
                                <input type="checkbox" id={daysLower[i]+ "IsBreakBool"+(j + 1)} name={daysLower[i]+ "IsBreakBool"+(j + 1)} />
                                <label htmlFor={daysLower[i]+ "PeriodStart"+(j + 1)} >Period Start:</label>
                                <input type="time" id={daysLower[i]+ "PeriodStart"+(j + 1)} name={daysLower[i]+ "PeriodStart"+(j + 1)} value={NumberOfPeriodsArray[i][2]} disabled/>
                                <label htmlFor={daysLower[i]+ "PeriodEnd"+(j + 1)} >Period End:</label>
                                <input type="time" onChange={() => setNextTime(j, i, sameDaysBool)} id={daysLower[i]+ "PeriodEnd"+(j + 1)} name={daysLower[i]+ "PeriodEnd"+(j + 1)} max={NumberOfPeriodsArray[i][3]}/>
                                <span className="errorText" id={daysLower[i]+ "PeriodValidation"+(j + 1)}></span>
                            </div>
                            
                        );
                    }else if(j === (NumberOfPeriodsArray[i][1] -1)){
                        tempDayArray.push(
                            
                            <div className="miniPeriodForum">
                                <label htmlFor={daysLower[i]+ "IsBreakBool"+(j + 1)} >Is a break?</label>
                                <input type="checkbox" id={daysLower[i]+ "IsBreakBool"+(j + 1)} name={daysLower[i]+ "IsBreakBool"+(j + 1)} />
                                <label htmlFor={daysLower[i]+ "PeriodStart"+(j + 1)} >Period Start:</label>
                                <input type="time" id={daysLower[i]+ "PeriodStart"+(j + 1)} name={daysLower[i]+ "PeriodStart"+(j + 1)} min={NumberOfPeriodsArray[i][2]} />
                                <label htmlFor={daysLower[i]+ "PeriodEnd"+(j + 1)} >Period End:</label>
                                <input type="time"  id={daysLower[i]+ "PeriodEnd"+(j + 1)} name={daysLower[i]+ "PeriodEnd"+(j + 1)} value={NumberOfPeriodsArray[i][3]} disabled/>
                                <span className="errorText" id={daysLower[i]+ "PeriodValidation"+(j + 1)}></span>
                            </div>
                            
                        );
                    }else{
                        tempDayArray.push(
                            
                            <div className="miniPeriodForum">
                                <label htmlFor={daysLower[i]+ "IsBreakBool"+(j + 1)} >Is a break?</label>
                                <input type="checkbox" id={daysLower[i]+ "IsBreakBool"+(j + 1)} name={daysLower[i]+ "IsBreakBool"+(j + 1)} />
                                <label htmlFor={daysLower[i]+ "PeriodStart"+(j + 1)} >Period Start:</label>
                                <input type="time" id={daysLower[i]+ "PeriodStart"+(j + 1)} name={daysLower[i]+ "PeriodStart"+(j + 1)} min={NumberOfPeriodsArray[i][2]}  disabled/>
                                <label htmlFor={daysLower[i]+ "PeriodEnd"+(j + 1)} >Period End:</label>
                                <input type="time" onChange={() => setNextTime(j, i, sameDaysBool)}  id={daysLower[i]+ "PeriodEnd"+(j + 1)} max={NumberOfPeriodsArray[i][3]} name={daysLower[i]+ "PeriodEnd"+(j + 1)} />
                                <span className="errorText" id={daysLower[i]+ "PeriodValidation"+(j + 1)}></span>
                            </div>
                            
                        );
                    }
            }
            daysColumns.push(tempDayArray);
        }
        console.log(daysColumns); 
        return(
            <table>
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">Monday</th>
                    <th scope="col">Tuesday</th>
                    <th scope="col">Wednesday</th>
                    <th scope="col">Thursday</th>
                    <th scope="col">Friday</th>
                    </tr>
                </thead>
                <tbody className='tableDisplayByColumns'>
                    <tr>
                        {firstColumn.map(column => (
                            <td key={column}>{column}</td> //column showing period names along left side
                        ))}
                    </tr>
                    <tr>
                        {
                            daysColumns[0].map((num, index)=> (
                                <td key={"monday"+(index + 1)}>
                                    {num}
                                </td>
                            ))
                        }
                    </tr>
                    <tr>
                        {
                            daysColumns[1].map((num, index)=> (
                                <td key={"tuesday"+(index + 1)}>
                                    <div className="miniPeriodForum">
                                        {num}
                                    </div>
                                </td>
                            ))
                        }
                    </tr>
                    <tr>
                        {
                            daysColumns[2].map((num, index)=> (
                                <td key={"wednesday"+(index + 1)}>
                                    <div className="miniPeriodForum">
                                        {num}
                                    </div>
                                </td>
                            ))
                        }
                    </tr>
                    <tr>
                        {
                            daysColumns[3].map((num, index)=> (
                                <td key={"thursday"+(index + 1)}>
                                    <div className="miniPeriodForum">
                                        {num}
                                    </div>
                                </td>
                            ))
                        }
                    </tr>
                    <tr>
                        {
                            daysColumns[4].map((num, index)=> (
                                <td key={"friday"+(index + 1)}>
                                    <div className="miniPeriodForum">
                                        {num}
                                    </div>
                                </td>
                            ))
                        }
                    </tr>
                    
                    
                    
                </tbody>
            </table>
        )
    }
}

function ConvertTimeFormatForDB(time){
    let timeArray = time.split(":");
    let hour = timeArray[0];
    let minute = timeArray[1];
    let newTime = "2004-05-16T" + hour + ":" + minute + ":00";
    return newTime;
}

function generateGuid() { 
    return uuidv4();
 }

function GetDateDbFormatNoTime(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    if(month < 10){
        month = "0" + month;
    }
    if(day < 10){
        day = "0" + day;
    }
    if(hours < 10){
        hours = "0" + hours;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}

export { GetDateDbFormatNoTime, GetDateString, GetJWTPayload, createStep, CreatePeriodSetterTable, ConvertTimeFormatForDB, generateGuid };