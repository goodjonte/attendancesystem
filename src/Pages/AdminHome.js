import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';
import Absences from '../Components/Absences';
import NavBar from '../Components/NavBar';

function AdminHome() {
  return (
    <div className="App">
      <NavBar userLoggedIn={true}/>
      
      <Absences displayAsPage={false}/>

      <div id="AdminHomeSecondRow">
        <NoticeBoard displayAsPage={false}/>
        <AdminActions />
      </div>

    </div>
  );
}

export default AdminHome;
