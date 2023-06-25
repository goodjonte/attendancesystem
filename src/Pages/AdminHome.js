import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';
import Absences from '../Components/Absences';
import NavBar from '../Components/NavBar';

function AdminHome() {

  

  return (
    <div className="App">
      <NavBar />
      <Absences />
      <div id="AdminHomeSecondRow">
        <NoticeBoard />
        <AdminActions />
      </div>
      
     
    </div>
  );
}

export default AdminHome;
