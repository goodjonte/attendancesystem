const apiURL = "https://localhost:7184/api/";

export async function GetNotices() {
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

// export async function UserIdToString(guid){
//     var response;
//     try{
//         response = await fetch(apiURL + 'User/GetUsersName?userId=' + guid , {
//             method: 'GET',
//             headers: {
//             'accept' : 'text/plain'
//             }
//         });
//         if(response.status === 200) {
//             return response.json();
//         }else{
//             return "User Not Found";
//         }
//     }catch(err){
//         console.log(err);
//     }
// }