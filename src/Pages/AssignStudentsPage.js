import React from 'react';
import '../App.css'
import AssignStudents from '../Components/AssignStudents';
import NavBar from '../Components/NavBar';

function AssignStudentsPage() {
    return (
        <div>
            <NavBar userLoggedIn={true} />
            <AssignStudents />
        </div>
    )
}

export default AssignStudentsPage;