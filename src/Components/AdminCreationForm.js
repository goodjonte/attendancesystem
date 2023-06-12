import '../App.css';
import * as ApiOperations from '../Operations/ApiOperations';
import Cookies from 'universal-cookie';

function AdminCreationForm() {
    const cookies = new Cookies();

    function FormSubmit(e){
        e.preventDefault();
        let adminObject = {
            "email": e.target.email.value,
            "password": e.target.password.value,
            "firstName": e.target.firstName.value,
            "lastName": e.target.lastName.value,
            "usersRole": 0,
            "parentName": "",
            "parentPhone": ""
        };
        console.log(adminObject);
        ApiOperations.CreateUser(adminObject).then(() => {
          let userLogin = {
            "email": e.target.email.value,
            "password": e.target.password.value
          }
          ApiOperations.LoginUser(userLogin).then((token) => {
            cookies.set('JWT_Token', token, { path: '/' });
            window.location.reload();
          });
        });

    };
    
    return (
      <div className="NoticeBoard">
        <form method='post' onSubmit={FormSubmit}>

            <label for='firstName'>FirstName:</label>
            <input type='text' id='firstName' name='firstName' placeholder='First Name' required/>

            <label for='lastName'>LastName:</label>
            <input type='text' id='lastName' name='lastName' placeholder='Last Name' required/>

            <label for='email'>Email:</label>
            <input type='text' id='email' name='email' placeholder='user123@email.com' required/>

            <label for='password'>Password:</label>
            <input type='password' id='password' name='password' placeholder='Password' required/>

            <button type='submit' className='btn btn-outline-dark'>Submit</button>

        </form>
      </div>
    );
  }
  
  export default AdminCreationForm;
  