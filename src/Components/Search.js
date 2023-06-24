import React /*, { useEffect }*/ from 'react';
import '../App.css';
import * as ApiOperations from '../Operations/ApiOperations';



//Using no search button for development purposes
//will need to implement button so there isnt a ridicoulous amount of calls to the api


export default function Search(){

    // const [searchString, setSearchString] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [radioSelected, setRadioSelected] = React.useState("teacher");
    const [searchMessage, setSearchMessage] = React.useState("");

    function search(searchString){
        if(searchString === "") return;

        try{
            var selected = document.querySelector('input[name="radios"]:checked').value;
            setSearchMessage("");
        }catch{
            document.getElementById('searchString').value = "";
            setSearchMessage("Please select a search type");
            return;
        }
        setRadioSelected(selected);
        switch(selected){
            case "teacher":
                ApiOperations.Get('User/GetTeachers').then((data) => {   
                    let filteredData = data.filter((element) => (element.firstName + " " + element.lastName).toUpperCase().includes(searchString.trim().toUpperCase()));
                    setResults(filteredData);
                });
                break;
            case "student":
                ApiOperations.Get('User/GetStudents').then((data) => {
                    let filteredData = data.filter((element) => (element.firstName + " " + element.lastName).toUpperCase().includes(searchString.trim().toUpperCase()));
                    setResults(filteredData);
                });
                break;
            case "class":
                ApiOperations.Get('SchoolClasses').then((data) => {
                    let filteredData = data.filter((element) => element.className.toUpperCase().includes(searchString.trim().toUpperCase()));
                    setResults(filteredData);
                });
                break;
            default:
                break;
        }
    }

    return(
        <div className='SearchBox'>
            <form>
                <label id="SearchTitle">Search For:</label><br/>
                <label className="radioLabel" htmlFor="teacherRadio">Teacher </label>
                <input className="radio" type="radio" id="teacherRadio" name="radios" value="teacher" /><br/>
                <label className="radioLabel" htmlFor="studentRadio">Student </label>
                <input className="radio" type="radio" id="studentRadio" name="radios" value="student"/><br/>
                <label className="radioLabel" htmlFor="classRadio">Class </label>
                <input className="radio" type="radio" id="classRadio" name="radios" value="class"/><br/>
                <p className={searchMessage !== "" ? "validationMessage" : "hidden"}>{searchMessage}</p>
                <input type="text" placeholder="search..." name="searchString" id="searchString" onChange={(event) => { event.preventDefault(); search(event.target.value); }} />
            </form>
            <div>
                {results.map((result, i) => {
                    switch(radioSelected){
                        case "teacher":
                            return(
                                <div key={"result" + i} >
                                    <a href={"/user?id="+result.id} value={result.id}>{result.firstName} {result.lastName}</a>
                                </div>
                            );
                        case "student":
                            return(
                                <div key={"result" + i} >
                                    <a href={"/user?id="+result.id} value={result.id}>{result.firstName} {result.lastName}</a>
                                </div>
                            );
                        case "class":
                            return(
                                <div key={"result" + i} >
                                    <a href={'/class?id=' + result.id + '&name=' + result.className} value={result.id}>{result.className}</a>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    )
} 