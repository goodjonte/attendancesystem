import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';

export default function UserProfile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    //Get user id from url and get user data from database upon first load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        ApiOperations.Get('User/GetUser?id=' + userId).then((response) => {
            setUser(response);
            setLoading(false);
        });
    }, []);


    //If pages is loading, display loading message
    if(loading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }else{  //Else display users profile based on users role 
    
        if(user.usersRole === 0 || user.usersRole ===  1){
            return(
                <div>
                    <h1>{user.firstName} {user.lastName}</h1>
                    <h2>Email:{user.email}</h2>
                </div>
            );
        }else{
            return(
                <div>
                    <h1>{user.firstName} {user.lastName}</h1>
                    <h2>Parents Name:{user.parentName}</h2>
                    <h2>Parents Number:{user.parentPhone}</h2>
                </div>
            );
        }
    };
};


