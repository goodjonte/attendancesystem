import '../App.css';
import Absences from '../Components/Absences';
import NavBar from '../Components/NavBar';

function AbsencesPage() {
    return (
        <div className="App">
            <NavBar userLoggedIn={true}/>
            <Absences displayAsPage={true}/>
        </div>
    );
}

export default AbsencesPage;
