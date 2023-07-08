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
      <div className="adminCreationForm">
        <form method='post' onSubmit={FormSubmit}>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">FirstName:</span>
            <input type='text' id='firstName' name='firstName' placeholder='First Name' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">LastName:</span>
            <input type='text' id='lastName' name='lastName' placeholder='Last Name' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Email:</span>
            <input type='text' id='email' name='email' placeholder='user123@email.com' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Password:</span>
            <input type='password' id='password' name='password' placeholder='Password' className="form-control" autoComplete="password-new" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <button type='submit' className='btn btn-success'>Submit</button>

        </form>
      </div>
    );
  }
  
  export default AdminCreationForm;
  