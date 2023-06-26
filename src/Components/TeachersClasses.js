import '../App.css';
import { useEffect, useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import Cookies from 'universal-cookie';

function TeachersClasses() {
    const [schoolClasses, setSchoolClasses] = useState(null);
    const [loading, setloading] = useState(true);

    //UseEffect to get teachers classes upon first render
    //In production will chang to get classes for current day and only current classes roll can be done
    useEffect(() => {
      const cookies = new Cookies();
      var headers = Operations.GetJWTPayload(cookies.get('JWT_Token'));
      ApiOperations.GetTeachersClasses(headers['user']).then((teachers) => {
        setSchoolClasses(teachers)
        setloading(false)
      });
    },[]);

    //Function to open class page
    function openClass(classId, className) {
      window.location.href = '/class?id=' + classId + '&name=' + className;
    }

    return (
      <div className="TeachersClasses">
        <h1>Your Classes</h1>
        {
          loading ?
          <div class="spinner-border" role="status"></div>
          :
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
  