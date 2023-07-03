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

                        var absentCount = 0;
                        var presentCount = 0;
                        var LateCount = 0;
                        for(var i = 0; i < attendancesResponse.length; i++){
                            if(attendancesResponse[i].isPresent){
                                if(attendancesResponse[i].isLate){
                                    LateCount++;
                                }else{
                                    presentCount++;
                                }
                            }else{
                                absentCount++;
                            }
                        }
                        // background-image: conic-gradient(orange 180deg, blue 180deg 270deg, black 270deg 360deg);
                        var absentPercent = parseInt((absentCount / attendancesResponse.length) * 100);
                        var presentPercent = parseInt((presentCount / attendancesResponse.length) * 100);
                        var latePercent = parseInt((LateCount / attendancesResponse.length) * 100);

                        if(absentPercent + presentPercent + latePercent < 100){
                            var diff = 100 - (absentPercent + presentPercent + latePercent);
                            for(var g = 0; g < diff; g++){
                                if(absentPercent > presentPercent && absentPercent > latePercent){
                                    absentPercent++;
                                }else if(presentPercent > absentPercent && presentPercent > latePercent){
                                    presentPercent++;
                                }else if(latePercent > absentPercent && latePercent > presentPercent){
                                    latePercent++;
                                }
                            }
                        }

                        var absentDeg = parseInt((absentPercent / 100) * 360);
                        var presentDeg = parseInt((presentPercent / 100) * 360);
                        var lateDeg = parseInt((latePercent / 100) * 360);

                        if(absentDeg + presentDeg + lateDeg < 360){
                            var diff2 = 360 - (absentDeg + presentDeg + lateDeg);
                            for(var f = 0; f < diff2; f++){
                                if(absentDeg > presentDeg && absentDeg > lateDeg){
                                    absentDeg++;
                                }else if(presentDeg > absentDeg && presentDeg > lateDeg){
                                    presentDeg++;
                                }else if(lateDeg > absentDeg && lateDeg > presentDeg){
                                    lateDeg++;
                                }
                            }
                        }

                        document.getElementById('pie').style.backgroundImage = "conic-gradient(red " + (absentDeg) + "deg, blue " + (absentDeg) + "deg " + (absentDeg+presentDeg) + "deg, black " + (absentDeg+presentDeg) + "deg "+ (absentDeg+presentDeg+lateDeg) +"deg)";
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
                                <div id='pie'></div>

                                <div id='Colors'>
                                    <div className='colorSample'>
                                        <div id="red"></div><span>= absent</span>
                                    </div>
                                    <div className='colorSample'>
                                        <div id="blue"></div><span>= present</span> 
                                    </div>
                                    <div className='colorSample'>
                                        <div id="black"></div><span>= late</span>
                                    </div>
                                </div>
                            
                            
                                <div className='AttendanceProfile'>
                                    <div className='AttendanceBox overflow-auto'>
                                    {attendances === null ?
                                        <Loading />
                                        :
                                        attendances.map(attendance => {
                                            return(
                                                <div className='AttendanceRow' key={attendance.id}>
                                                    <p>Class Name: {GetClassName(attendance.classId)}</p>
                                                    <p>{attendance.classesPeriod} - {Operations.stringifyDate(attendance.date)}</p>
                                                    <p>{attendance.isPresent ? "Present" : "Absent"}</p>
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


