import '../App.css';
import React, { useState, useEffect } from "react";
import * as ApiOperations from '../Operations/ApiOperations';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Search from './Search';
import Cookies from 'universal-cookie';
import * as Operations from '../Operations/Operations';

export default function NavBar(props) {

        

        const [schoolName, setSchoolName] = useState("");
        const [usersName, setUsersName] = useState("User");
        const [role, setRole] = useState("Role");

        useEffect(() => {
            if(props.userLoggedIn){
                const cookies = new Cookies();
                var currentToken = cookies.get('JWT_Token');
                let tokenClaims = Operations.GetJWTPayload(currentToken);
                var UserId = tokenClaims["user"];

                ApiOperations.Get('User/GetUser?id=' + UserId).then((response) => {
                    console.log(response);
                    setUsersName(response.firstName + " " + response.lastName);
                    switch (response.usersRole) {
                        case 0:
                            setRole("Adminastrator");
                            break;
                        case 1:
                            setRole("Teacher");
                            break;
                        default:
                            setRole("Student"); 
                            break;
                    }
                });
            }
            ApiOperations.Get('Schools').then((response) => {
                setSchoolName(response[0].schoolName);
            });

            //eslint-disable-next-line
        }, []);

        function logOut(){
            const cookies = new Cookies();
            cookies.remove('JWT_Token');
            window.location.href = '/';
        }
    
        return (
        <Navbar key={false} expand={false} className="bg-body-tertiary navbarCont">
          <Container fluid>
            <Navbar.Brand href="/">{schoolName}</Navbar.Brand>
            {props.userLoggedIn ? <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} /> : null}
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${false}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
              placement="end" 
              className="offcanvasNav"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                  <h2>{schoolName}</h2>
                  <h5>Logged in as: {usersName}</h5>
                  <h5>Role: {role}</h5>
                  <h6 onClick={() => logOut()} className='logoutLink'>Logout</h6>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>

                { role === "Adminastrator" ? //Display this nav to admins only

                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/notices">Notices</Nav.Link>
                        <Nav.Link href="/absences">Absences</Nav.Link>
                        
                        <NavDropdown
                            title="Admin Actions"
                            id={`offcanvasNavbarDropdown-expand-${false}`}
                        >
                            <NavDropdown.Item href="/adminaction?action=teacher">Add a Teacher</NavDropdown.Item>
                            <NavDropdown.Item href="/adminaction?action=student">Add a Student</NavDropdown.Item>
                            <NavDropdown.Item href="/adminaction?action=class">Add a Class</NavDropdown.Item>
                            
                        </NavDropdown>
                        
                    </Nav>

                : //Display this nav to teachers only
                
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                            
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/">My Classes</Nav.Link>
                        <Nav.Link href="/">Notices</Nav.Link>

                    </Nav>

                }

                <Search />
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        );
}