
import '../App.css';
import React from 'react';
import Cookies from 'universal-cookie';
import Config from '../Config.js';  


export default function Login(){
    const [registerMessage, setRegisterMessage] = React.useState("");
    const cookies = new Cookies();
    
    //Login Submit Function
    async function LoginSubmit(event){
        event.preventDefault();
        let userName = event.target.userNameLogin.value;
        let password = event.target.passwordLogin.value;
        let userObj = {
            "email": userName,
            "password": password
        }

        var response;
        try{
            response = await fetch(Config.getApiUrl() + 'User/login', {
                method: 'POST',
                body: JSON.stringify(userObj),
                headers: {
                'accept' : 'application/json',
                'Content-Type' : 'application/json',
                }
            });
            if(response.status === 400){
                setRegisterMessage("Incorrect Username or Password!");
                return;
            }else{
                let token = await response.json();
                console.log("token set");
                cookies.set('JWT_Token', token, { path: '/' });
                window.location.reload();
            }
        }catch(err){
            setRegisterMessage("Error");
            console.log(err);
        }

    }


    return (
        <div className='Page'>
            <div className='loginPage'>
                <div className={ "loginBox" }>
                    <h2 className='text-color'>Login</h2>
                    <form className='LoginForm' method="post" onSubmit={LoginSubmit}>
                        
                        <div className="input-group inputLoginPage">
                            <span className='input-group-text'>Username: </span>
                            <input className='form-control' type="text" name="userNameLogin" id="userNameLogin" />
                        </div>

                        <div className="input-group inputLoginPage">
                            <span className='input-group-text'>Password: </span>
                            <input className='form-control' type="password" name="passwordLogin" autoComplete='current-password' id="passwordLogin" />
                        </div>
                        {registerMessage}
                        <button type='submit' className='btn btn-outline-dark'>Submit</button>
                    </form>
                </div>

            </div>
        </div>
    )
}