import React, { useState, useEffect } from 'react';
import * as ApiOperations from '../Operations/ApiOperations';

export default function Absences(){
    const [absences, setAbsences] = useState([]);

    useEffect(() => {
        ApiOperations.GetAbsences().then(abs => {
            console.log(abs);
            setAbsences(abs);
        });
    }, []);

    

    return (
      <div className="Absence">
        <div className="AbsencesHeader">
            <h1>Absences</h1>
        </div>
        <div className='Absences'>
            {
                absences.map(abs => {
                    return (
                        <div className='Note' key={abs.attendanceId}>
                            <h2>{abs.studentName}</h2>
                            <p>{abs.className}</p>
                            <p>
                                {abs.status}
                            </p>
                        </div>
                    )
                })
            }
        </div>
      </div>
    );
}