import '../App.css';
import AdminActions from '../Components/AdminActions';
import NavBar from '../Components/NavBar';

function AdminActionsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlAction = urlParams.get('action');

    //If no action is specified, display the default admin actions page
    if (urlAction == null) {
        return (
            <div className="App">
                <NavBar userLoggedIn={true}/>
                <AdminActions action={"none"}/>
            </div>
        );
    }
    //If an action is specified, display the admin actions page with the specified action
    return (
        <div className="App">
            <NavBar userLoggedIn={true}/>
            <AdminActions action={urlAction}/>
        </div>
    );
}

export default AdminActionsPage;
