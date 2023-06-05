export function GetDateString() {
    const monthStrings = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date();
    return (
        dayStrings[date.getDay()] + ", " + date.getDate()+ " " + monthStrings[date.getMonth()] + " " + date.getFullYear()
    )
}
