import '../App.css';
import TeachersClasses from '../Components/TeachersClasses';
import NavBar from '../Components/NavBar';

function TeachersClasssesPage() {
    return (
        <div className="App">
            <NavBar userLoggedIn={true}/>
            <div className='flexMid'>
                <TeachersClasses />
            </div>
        </div>
    );
}

export default TeachersClasssesPage;
