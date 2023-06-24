const apiURL = "https://localhost:7184/api/";

async function DatabaseTest() {
    //fetch to test if db has data        
    var response;
    try{
        response = await fetch(apiURL + 'SchoolWeeks', {
            method: 'GET',
            headers: {
            'accept' : 'text/plain'
            }
        });
        if(response.status === 200) {
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
    }
}

async function GetNotices() {
    var response;
    try{
        response = await fetch(apiURL + 'Notices', {
            method: 'GET',
            headers: {
            'accept' : 'text/plain'
            }
        });
        if(response.status === 200) {
            return response.json();
        }else{
            return "Error";
        }
    }catch(err){
        console.log(err);
    }
}

async function GetTeachersClasses(teachersId) {
    if(teachersId !== undefined){
        var response;
        try{
            response = await fetch(apiURL + 'SchoolClasses/' + teachersId + '/true', {
                method: 'GET',
                headers: {
                'accept' : 'text/plain'
                }
            });
            return await response.json();
        }catch(err){
            console.log(err);
        }
    }
    return "No Guid Passed In"
}

async function GetClassesStudents(classId) {
    if(classId !== undefined){
        var response;
        try{
            response = await fetch(apiURL + 'Enrollments/' + classId, {
                method: 'GET',
                headers: {
                'accept' : 'text/plain'
                }
            });
                       
            return await response.json();
        }catch(err){
            console.log(err);
        }
    }
    return "No Guid Passed In"
}

async function CreateUser(userObject){
    var response;
    try{
        response = await fetch(apiURL + 'User/register', {
            method: 'POST',
            body: JSON.stringify(userObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
            }
        });
                    
        return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function CreatePeriod(periodObject){
    var response;
    try{
        response = await fetch(apiURL + 'SchoolPeriods', {
            method: 'POST',
            body: JSON.stringify(periodObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
            }
        });
        return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function CreateDay(dayObject){
    var response;
    try{
        response = await fetch(apiURL + 'SchoolDays', {
            method: 'POST',
            body: JSON.stringify(dayObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
            }
        });
        return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function CreateWeek(weekObject){
    var response;
    try{
        response = await fetch(apiURL + 'SchoolWeeks', {
            method: 'POST',
            body: JSON.stringify(weekObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
            }
        });
        return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function CreateSchool(schoolObject){
    var response;
    try{
        response = await fetch(apiURL + 'Schools', {   
            method: 'POST',
            body: JSON.stringify(schoolObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json'
            }
        });
        return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function LoginUser(userObj){
    var response;
    try{
        response = await fetch(apiURL + 'User/login', {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json',
            }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}
async function CreateClass(ClassObject){
    var response;
    try{
        response = await fetch(apiURL + 'SchoolClasses', {
            method: 'POST',
            body: JSON.stringify(ClassObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json',
            }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function GetTeachers(){
    var response;
    try{
        response = await fetch(apiURL + 'User/GetTeachers', {
            method: 'Get',
            headers: {
                'accept' : 'text/plain'
                }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function Get(restOfUrl){
    var response;
    try{
        response = await fetch(apiURL + restOfUrl, {
            method: 'Get',
            headers: {
                'accept' : 'text/plain'
                }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function AsignClassToPeriod(classAssingmentObject){
    var response;
    try{
        response = await fetch(apiURL + 'ClassesPeriods', {
            method: 'POST',
            body: JSON.stringify(classAssingmentObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json',
            }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function Post(object, apiString ){
    var response;
    try{
        response = await fetch(apiURL + apiString, {
            method: 'POST',
            body: JSON.stringify(object),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json',
            }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function GetUsersName(userId){
    var response;
    try{
        response = await fetch(apiURL + "User/" + userId, {
            method: 'Get',
            headers: {
                'accept' : 'text/plain'
                }
        });
            return response;
    }catch(err){
        console.log(err);
    }
}

async function GetAbsences(){
    var response;
    try{
        response = await fetch(apiURL + "Attendances/GetUnjustifiedAbsences", {
            method: 'Get',
            headers: {
                'accept' : 'text/plain'
                }
        });
            return await response.json();
    }catch(err){
        console.log(err);
    }
}

async function ResolveAbsence(absenceObject){
    var response;
    try{
        response = await fetch(apiURL + "Attendances/ResolveAbsence", {
            method: 'POST',
            body: JSON.stringify(absenceObject),
            headers: {
            'accept' : 'application/json',
            'Content-Type' : 'application/json',
            }
        });
        if(response.ok){
            return "Success";
        }
            return await response;
    }catch(err){
        console.log(err);
    }
}


export { ResolveAbsence, GetAbsences, GetUsersName, DatabaseTest, AsignClassToPeriod, GetClassesStudents, Post, GetTeachersClasses, GetNotices, CreateUser, CreatePeriod, CreateDay, CreateWeek, CreateSchool, LoginUser, CreateClass, GetTeachers, Get };