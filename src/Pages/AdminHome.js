import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';
import SchoolWeekCreator from '../Components/SchoolWeekCreator';

function AdminHome() {

  

  return (
    <div className="App">
      <h1>Logged In As Admin</h1>
      <NoticeBoard />
      <AdminActions />
      <SchoolWeekCreator />
     
    </div>
  );
}

export default AdminHome;
