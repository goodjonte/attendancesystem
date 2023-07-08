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
                    <div className="input-group mb-3 numOfPeriodsSingular">
                        <span className="input-group-text" id="inputGroup-sizing-default ">Number of Periods Incl Breaks</span>
                        <input type="number" id="everydayNumOfPeriods" name="everydayNumOfPeriods" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                )
            }else {
                return (
                    <table id='step3NotSameTable'>
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

function CapitalizeFirstChar(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function stringifyDate(date){//2023-07-03T19:34:54 format
    var splitDate = date.split("T");
    splitDate = splitDate[0].split("-");
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];
    return day + "/" + month + "/" + year;
}

// Present = 0,
// Justified = 1,
// Unjustified = 2,
// OverseasJustified = 3
function CreatePieChart(attendance) {
    var justifiedCount = 0;
    var presentCount = 0;
    var unjustifiedCount = 0;
    var LateCount = 0;
    var OverseasJustifiedCount = 0;

    for(var i = 0; i < attendance.length; i++){//Get a count of each status and late bool
        
        switch(attendance[i].status){
            case 0:
                if(attendance[i].isLate){
                    LateCount++;
                }else{
                    presentCount++;
                }
                break;
            case 1:
                justifiedCount++;
                break;
            case 2:
                unjustifiedCount++;
                break;
            case 3:
                OverseasJustifiedCount++;
                break;
            default:
                break;
        }
    }
    //convert each count ot a percent
    var unjustifiedPercent = parseInt((unjustifiedCount / attendance.length) * 100);
    var presentPercent = parseInt((presentCount / attendance.length) * 100);
    var latePercent = parseInt((LateCount / attendance.length) * 100);
    var justifiedPercent = parseInt((justifiedCount / attendance.length) * 100);
    var overseasJustifiedPercent = parseInt((OverseasJustifiedCount / attendance.length) * 100);

    //add 1 to the highest perecent untill total is 100%
    if(unjustifiedPercent + presentPercent + latePercent + justifiedPercent + overseasJustifiedPercent < 100){
        var diff = 100 - (unjustifiedPercent + presentPercent + latePercent + justifiedPercent + overseasJustifiedPercent);
        for(var g = 0; g < diff; g++){
            if(unjustifiedPercent > presentPercent && unjustifiedPercent > latePercent && unjustifiedPercent > justifiedPercent && unjustifiedPercent > overseasJustifiedPercent){
                unjustifiedPercent++;
            }else if(presentPercent > unjustifiedPercent && presentPercent > latePercent && presentPercent > justifiedPercent && presentPercent > overseasJustifiedPercent){
                presentPercent++;
            }else if(latePercent > unjustifiedPercent && latePercent > presentPercent && latePercent > justifiedPercent && latePercent > overseasJustifiedPercent){
                latePercent++;
            }else if(justifiedPercent > unjustifiedPercent && justifiedPercent > presentPercent && justifiedPercent > latePercent && justifiedPercent > overseasJustifiedPercent){
                justifiedPercent++;
            }else if(overseasJustifiedPercent > unjustifiedPercent && overseasJustifiedPercent > presentPercent && overseasJustifiedPercent > latePercent && overseasJustifiedPercent > justifiedPercent){
                overseasJustifiedPercent++;
            }
        }
    }

    var unjustifiedDeg = parseInt((unjustifiedPercent / 100) * 360);
    var justifiedDeg = parseInt((justifiedPercent / 100) * 360);
    var OverseasJustifiedDeg = parseInt((overseasJustifiedPercent / 100) * 360);
    var presentDeg = parseInt((presentPercent / 100) * 360);
    var lateDeg = parseInt((latePercent / 100) * 360);

    if((OverseasJustifiedDeg + justifiedDeg + unjustifiedDeg + presentDeg + lateDeg) < 360){
        var diff2 = 360 - (OverseasJustifiedDeg + justifiedDeg + unjustifiedDeg + presentDeg + lateDeg);
        for(var f = 0; f < diff2; f++){
            if(unjustifiedDeg > justifiedDeg && unjustifiedDeg > OverseasJustifiedDeg && unjustifiedDeg > presentDeg && unjustifiedDeg > lateDeg){
                unjustifiedDeg++;
            }else if(justifiedDeg > unjustifiedDeg && justifiedDeg > OverseasJustifiedDeg && justifiedDeg > presentDeg && justifiedDeg > lateDeg){
                justifiedDeg++;
            }else if(OverseasJustifiedDeg > justifiedDeg && OverseasJustifiedDeg > unjustifiedDeg && OverseasJustifiedDeg > presentDeg && OverseasJustifiedDeg > lateDeg){
                OverseasJustifiedDeg++;
            }else if(presentDeg > justifiedDeg && presentDeg > unjustifiedDeg && presentDeg > OverseasJustifiedDeg && presentDeg > lateDeg){
                presentDeg++;
            }else if(lateDeg > justifiedDeg && lateDeg > unjustifiedDeg && lateDeg > OverseasJustifiedDeg && lateDeg > presentDeg){
                lateDeg++;
            }
        }
    }

    //red = unjustified absence
    //darkblue = justified absence
    //orange = overseas justified absence
    //green = present
    //black = late to class
    var pieCss =  "conic-gradient(red " + (unjustifiedDeg) + "deg, darkblue " + (unjustifiedDeg) + "deg " + (unjustifiedDeg+justifiedDeg) + "deg, orange " + (unjustifiedDeg+justifiedDeg) + "deg "+ ((unjustifiedDeg+justifiedDeg)+OverseasJustifiedDeg) +"deg, green " + ((unjustifiedDeg+justifiedDeg)+OverseasJustifiedDeg) + "deg "+ (((unjustifiedDeg+justifiedDeg)+OverseasJustifiedDeg)+presentDeg) +"deg, black " + (((unjustifiedDeg+justifiedDeg)+OverseasJustifiedDeg)+presentDeg) + "deg "+ ((((unjustifiedDeg+justifiedDeg)+OverseasJustifiedDeg)+presentDeg)+lateDeg) +"deg)";
    return {
        "background": pieCss,
        "totalDays": attendance.length,
        "present": presentCount,
        "unjustified": unjustifiedCount,
        "justified": justifiedCount,
        "overseasJustified": OverseasJustifiedCount,
        "late": LateCount,
        "presentPercent": presentPercent,
        "unjustifiedPercent": unjustifiedPercent,
        "justifiedPercent": justifiedPercent,
        "overseasJustifiedPercent": overseasJustifiedPercent,
        "latePercent": latePercent
    }
}

function AttendanceStatusToString(num){
    switch(num){
        case 0:
            return "Present";
        case 1:
            return "Justified";
        case 2:
            return "Unjustified";
        case 3:
            return "Overseas Justified";
        default:
            return "Error";
    }
}

export { AttendanceStatusToString, CreatePieChart, stringifyDate, CapitalizeFirstChar, GetDateDbFormatNoTime, GetDateString, GetJWTPayload, createStep, CreatePeriodSetterTable, ConvertTimeFormatForDB, generateGuid };