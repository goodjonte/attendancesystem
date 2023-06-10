const apiURL = "https://localhost:7184/api/";

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
            response = await fetch(apiURL + 'SchoolClasses/' + teachersId, {
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


export { GetClassesStudents, GetTeachersClasses, GetNotices, CreateUser };