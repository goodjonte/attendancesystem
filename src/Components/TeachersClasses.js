import '../App.css';
import { useEffect, useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import Cookies from 'universal-cookie';

function TeachersClasses() {

    const [schoolClasses, setSchoolClasses] = useState(null);
    const cookies = new Cookies();
    var headers = Operations.GetJWTPayload(cookies.get('JWT_Token'));

    useEffect(() => {
      ApiOperations.GetTeachersClasses(headers['user']).then((teachers) => setSchoolClasses(teachers));
    })

    function openClass(classId, className) {
      window.location.href = '/class?id=' + classId + '&name=' + className;
    }

    return (
      <div className="TeachersClasses">
        <h1>Your Classes</h1>
        {
          schoolClasses == null || schoolClasses === [] ? "No Classes Today" : schoolClasses.map(schoolClass => {
          return (
            <div className='Class' key={schoolClass.id}>
                <h2 onClick={() => openClass(schoolClass.id, schoolClass.className)}>{schoolClass.className}</h2>
            </div>
          )})
        }
      </div>
    );
  }
  
  export default TeachersClasses;
  