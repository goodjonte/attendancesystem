import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';
import Search from '../Components/Search';
import Absences from '../Components/Absences';

function AdminHome() {

  

  return (
    <div className="App">
      <h1>Logged In As Admin</h1>
      <Absences />
      <NoticeBoard />
      <AdminActions />
      <Search />
      
     
    </div>
  );
}

export default AdminHome;
