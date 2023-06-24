import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';
import Absences from '../Components/Absences';
import NavBar from '../Components/NavBar';

function AdminHome() {

  

  return (
    <div className="App">
      <NavBar />
      <h1>Logged In As Admin</h1>
      <Absences />
      <NoticeBoard />
      <AdminActions />
      
     
    </div>
  );
}

export default AdminHome;
