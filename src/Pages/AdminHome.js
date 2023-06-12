import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import AdminActions from '../Components/AdminActions';

function AdminHome() {

  

  return (
    <div className="App">
      <h1>Logged In As Admin</h1>
      <NoticeBoard />
      <AdminActions />
     
    </div>
  );
}

export default AdminHome;
