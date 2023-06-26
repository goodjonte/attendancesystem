import '../App.css';
import TeachersClasses from '../Components/TeachersClasses';
import NavBar from '../Components/NavBar';
import NoticeBoard from '../Components/NoticeBoard';

function TeacherHome() {
  return (
    <div className="App">
      <NavBar userLoggedIn={true} />
      <div id='TeacherHomeSecondRow'>
        <NoticeBoard displayAsPage={false} />
        <TeachersClasses />
      </div>
      

    </div>
  );
}

export default TeacherHome;
