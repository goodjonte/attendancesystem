import '../App.css';
import { useEffect, useState } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';

export default function UserProfile() {

    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        ApiOperations.Get('User/GetUser?id=' + userId).then((response) => {
            setUser(response);
        });

        
    }, []);

    function profileHtml(userObject){
        if(userObject.usersRole === 0 || userObject.usersRole ===  1){

            return(
                <div>
                    <h1>{userObject.firstName} {userObject.lastName}</h1>
                    <h2>Email:{userObject.email}</h2>
                </div>
            );
        }else{
            return(
                <div>
                    <h1>{userObject.firstName} {userObject.lastName}</h1>
                    <h2>Parents Name:{userObject.parentName}</h2>
                    <h2>Parents Number:{userObject.parentPhone}</h2>
                </div>
            );
        }
    }
   
    //Make into form with drop down box next to each student with absent, present, unjustified, justified
  return (
    <div className="App">
        {
            user != null ? 
            profileHtml(user)
            : null
        }
    </div>
  );
}


