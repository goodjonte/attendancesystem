import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';
import * as Operations from '../Operations/Operations';
import NavBar from '../Components/NavBar';
import Loading from '../Components/Loading';
import EmptyProfilePicture from '../Assets/blank-profile-picture.png';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    //Get user id from url and get user data from database upon first load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        ApiOperations.Get('User/GetUser?id=' + userId).then((response) => {
            setUser(response);
            if(response.usersRole === 2){
                ApiOperations.Get('Attendances/' + response.id).then((response) => {
                    console.log(response);
                });
            }
            setLoading(false);
        });
    }, []);




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
                    </div>
                </div>
            );
        }
    };
};


