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
        //UseEffect to get school name from database upon first render for nav title
        //Also gets users information if user is logged in
        //User info is used to decide what to show in nav, also used to display name and role within nav
        useEffect(() => {
            if(props.InSetup !== true){
              if(props.userLoggedIn){
                  const cookies = new Cookies();
                  var currentToken = cookies.get('JWT_Token');
                  let tokenClaims = Operations.GetJWTPayload(currentToken);
                  var UserId = tokenClaims["user"];

                  ApiOperations.Get('User/GetUser?id=' + UserId).then((response) => {
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
            }
          //eslint-disable-next-line
        }, []);

        //Function to handle logging out
        function logOut(){
            const cookies = new Cookies();
            cookies.remove('JWT_Token');
            window.location.href = '/';
        }
        
        if(props.InSetup === true){
          return (
          <Navbar className="bg-body-tertiary navbarCont">
          
            <Navbar.Brand className="setupTitle" href="/">School Attendance System</Navbar.Brand>
          
          </Navbar>
          );
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
                            <NavDropdown.Item href="/AssignStudents">Assign Student to a Class</NavDropdown.Item>
                            
                        </NavDropdown>
                        
                    </Nav>

                : //Display this nav to teachers only
                
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                            
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/myclasses">My Classes</Nav.Link>
                        <Nav.Link href="/notices">Notices</Nav.Link>

                    </Nav>

                }

                <Search />
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        );
}