import '../App.css';
import NoticeBoard from '../Components/NoticeBoard';
import NavBar from '../Components/NavBar';

function NoticesPage() {
  return (
    <div className="App">
        <NavBar userLoggedIn={true}/>
        <NoticeBoard displayAsPage={true}/>
    </div>
  );
}

export default NoticesPage;
