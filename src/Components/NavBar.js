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

export default function NavBar() {

        const [schoolName, setSchoolName] = useState("");
        const [usersName, setUsersName] = useState("User");
        const [role, setRole] = useState("Role");

        useEffect(() => {
            const cookies = new Cookies();
            var currentToken = cookies.get('JWT_Token');
            let tokenClaims = Operations.GetJWTPayload(currentToken);
            var UserId = tokenClaims["user"];

            ApiOperations.Get('Schools').then((response) => {
                setSchoolName(response[0].schoolName);
            });
            // {    user response example
            //     "id": "a09f315a-3ee6-47f8-b1a0-8e201410be7e",
            //     "firstName": "string",
            //     "lastName": "string",
            //     "canLogin": true,
            //     "email": "string",
            //     "passwordHash": "ppDhJ49NPEgpCz2YT7zJuFer9xnzWObeJgWw6gA5l6SukI46IRQYSeZnRtA7Os6eSEQ8Suy0JuyxWEscnSpwqA==",
            //     "passwordSalt": "ubyjWoJw6KN0Wsq6tA6y+1azK8hX5HrcGK+ftvzOwKexhcrdzaOgReE5Pw58S7Zs5cLalLR2rUEHXApq1rWeQr6Y9qcxONWwvmcalYWBjNMDvApFdB2FcW893LFM/v9Lj1F7ji6pKTNEE5V6t/zskx6Y3if+0F1hvaPtql6OAhg=",
            //     "usersRole": 0,
            //     "parentName": null,
            //     "parentPhone": null
            //   }
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
        }, []);


    
        return (
        <Navbar key={false} expand={false} className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="/">{schoolName}</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${false}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                  <h2>{schoolName}</h2>
                  <h5>Logged in as: {usersName}</h5>
                  <h5>Role: {role}</h5>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>

                { role === "Adminastrator" ? //Display this nav to admins only

                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/">Notices</Nav.Link>
                        <Nav.Link href="/">Absences</Nav.Link>
                        
                        <NavDropdown
                            title="Admin Actions"
                            id={`offcanvasNavbarDropdown-expand-${false}`}
                        >
                            <NavDropdown.Item href="#action3">Add a Teacher</NavDropdown.Item>
                            <NavDropdown.Item href="#action3">Add a Student</NavDropdown.Item>
                            <NavDropdown.Item href="#action3">Add a Class</NavDropdown.Item>
                            
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