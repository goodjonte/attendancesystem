import '../App.css';
import { useEffect, useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import Cookies from 'universal-cookie';
import Loading from './Loading';

function TeachersClasses(props) {
    const [schoolClasses, setSchoolClasses] = useState(null);
    const [loading, setloading] = useState(true);

    //UseEffect to get teachers classes upon first render
    //In production will chang to get classes for current day and only current classes roll can be done
    useEffect(() => {
      if(props.user === undefined){
      const cookies = new Cookies();
      var headers = Operations.GetJWTPayload(cookies.get('JWT_Token'));
      ApiOperations.GetTeachersClasses(headers['user']).then((teachers) => {
        setSchoolClasses(teachers)
        setloading(false)
      });
    }else{
      ApiOperations.GetTeachersClasses(props.user).then((teachers) => {
        setSchoolClasses(teachers)
        setloading(false)
      }
      );
    }//eslint-disable-next-line
    },[]);

    //Function to open class page
    function openClass(classId, className) {
      window.location.href = '/class?id=' + classId + '&name=' + className;
    }

    return (
      <div className="TeachersClasses overflow-auto">
        <h1>Classes</h1>
        {
          loading ?
          <Loading />
          :
          <div className='classList'>
            {
          schoolClasses == null || schoolClasses === [] ? "No Classes Today" : schoolClasses.map(schoolClass => {
          return (
            <div onClick={() => openClass(schoolClass.id, schoolClass.className)} className='Class' key={schoolClass.id}>
                <h2 >{schoolClass.className}</h2>
            </div>
          )})
          }
          </div>
        }
      </div>
    );
  }
  
  export default TeachersClasses;
  