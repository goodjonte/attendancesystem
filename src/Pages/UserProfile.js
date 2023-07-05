import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';
import NavBar from '../Components/NavBar';
import Loading from '../Components/Loading';
import EmptyProfilePicture from '../Assets/blank-profile-picture.png';
import TeachersClasses from '../Components/TeachersClasses';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendances, setAttendances] = useState(null);
    const [schoolClasses, setSchoolClasses] = useState(null);
    const [absenceData, setAbsenceData] = useState(null);
    

    
    //Get user id from url and get user data from database upon first load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        ApiOperations.Get('User/GetUser?id=' + userId).then((response) => {
            setUser(response);
            if(response.usersRole === 2){
                
                ApiOperations.Get('SchoolClasses').then((classResponse) => {
                    setSchoolClasses(classResponse);
                    console.log(classResponse);
                    ApiOperations.Get('Attendances/' + response.id).then((attendancesResponse) => {
                            

                        setAttendances(attendancesResponse);
                        var pieChartData = Operations.CreatePieChart(attendancesResponse);
                        document.getElementById('pie').style.backgroundImage = pieChartData.background;
                        setAbsenceData(pieChartData);
                    });
                    
                });
            }
            setLoading(false);
        });
    }, []);

    function GetClassName(classId){
        var className = '';
        schoolClasses.forEach(schoolClass => {
            if(schoolClass.id === classId){
                className = schoolClass.className;
            }
        });
        return className;
    }

    //If pages is loading, display loading message
    if(loading){
        return(
            <div>
                <NavBar userLoggedIn={true}/>
                <Loading />
            </div>
        );
    }else{  //Else display users profile based on users role 
    
        if(user.usersRole === 0 || user.usersRole ===  1){
            return(
                <div>
                    <NavBar userLoggedIn={true}/>
                        <div className='TeachersProfile' >
                            <div id="userHeader">
                                <div id="userimg">
                                    <img src={EmptyProfilePicture} alt="Profile" width="200" height="200" />
                                </div>
                                <div id="userinfo">
                                    <h1>{Operations.CapitalizeFirstChar(user.firstName)} {Operations.CapitalizeFirstChar(user.lastName)}</h1>
                                    <h2>Email:  {user.email}</h2>
                                </div>
                            </div>
                            {user.usersRole ===  1 ? 
                                <div className='TeachersClassesUserPage'>
                                    <TeachersClasses user={user.id}/>
                                </div>
                                :
                                null
                            }
                        </div>
                </div>
            );
        }else{
            return(
                <div>
                    <NavBar userLoggedIn={true}/>
                    <div className='StudentsProfile' >
                        <div id="userHeader">
                            <div id="userimg">
                                <img src={EmptyProfilePicture} alt="Profile" width="200" height="200" />
                            </div>
                            <div id="userinfo">
                                <h1>{Operations.CapitalizeFirstChar(user.firstName)} {Operations.CapitalizeFirstChar(user.lastName)}</h1>

                                <h6>Parents Name:  {Operations.CapitalizeFirstChar(user.parentName)}</h6>
                                <h6>Parents Number:  {user.parentPhone}</h6>
                            </div>
                        </div>
                        <div className='StudentPageBody'>
                            <h2 className='centerText'>Students Attendance</h2>
                            
                            <div id="ChartArea">
                                <div className='pieAndColors'>
                                    <div id='pie'></div>
                                    
                                    <div id='Colors'>
                                        <div className='colorSample'>
                                            <div id="red"></div>= Unjustified
                                        </div>
                                        <div className='colorSample'>
                                            <div id="darkblue"></div><span>= Justified</span> 
                                        </div>
                                        <div className='colorSample'>
                                            <div id="green"></div><span>= Present</span>
                                        </div>
                                        <div className='colorSample'>
                                            <div id="black"></div><span>= Late</span>
                                        </div>
                                        <div className='colorSample'>
                                            <div id="orange"></div><span>= Overseas</span>    
                                        </div>
                                    </div>
                                </div>

                                {absenceData === null ? <Loading /> :
                                <div className='AttendanceData'>
                                    <h6>Present = {absenceData.present} - {absenceData.presentPercent}%</h6>
                                    <h6>Late to Class = {absenceData.late} - {absenceData.latePercent}%</h6>
                                    <h6>Unjustified Absence = {absenceData.unjustified} - {absenceData.unjustifiedPercent}%</h6>
                                    <h6>ustified Absence = {absenceData.justified} - {absenceData.justifiedPercent}%</h6>
                                    <h6>Overseas Justified Absence = {absenceData.overseasJustified} - {absenceData.overseasJustifiedPercent}%</h6>
                                    <h6>Total = {absenceData.totalDays}</h6>
                                </div>
                                }

                                <div className='AttendanceProfile'>
                                    <div className='AttendanceBox overflow-auto'>
                                    {attendances === null ?
                                        <Loading />
                                        :
                                        attendances.map(attendance => {
                                            return(
                                                <div className='AttendanceRow' key={attendance.id}>
                                                    <div>{GetClassName(attendance.classId)}</div>
                                                    <div>{attendance.classesPeriod} - {Operations.stringifyDate(attendance.date)}</div>
                                                    <div>{attendance.isPresent ? "Present" : "Absent"}</div>
                                                </div>
                                            );
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };
};


