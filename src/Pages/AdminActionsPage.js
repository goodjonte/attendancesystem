import '../App.css';
import AdminActions from '../Components/AdminActions';
import NavBar from '../Components/NavBar';

function AdminActionsPage() {

    const urlParams = new URLSearchParams(window.location.search);
    const urlAction = urlParams.get('action');
    if (urlAction == null) {
        return (
            <div className="App">
                <NavBar userLoggedIn={true}/>
                <AdminActions action={"none"}/>
            </div>
        );
    }
    return (
        <div className="App">
            <NavBar userLoggedIn={true}/>
            <AdminActions action={urlAction}/>
        </div>
    );
}

export default AdminActionsPage;
