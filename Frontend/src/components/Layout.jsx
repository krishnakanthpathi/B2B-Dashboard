import { NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Bell, HelpCircle, User } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Header */}
      <Navbar bg="white" expand="lg" className="border-bottom">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="bg-light px-3 py-2 me-4 text-secondary fw-bold">
            LOGO
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            <Button variant="light" className="rounded-circle p-2 me-2">
              <HelpCircle size={22} />
            </Button>
            <Button variant="light" className="rounded-circle p-2 me-3">
              <Bell size={22} />
            </Button>
            <Button className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#6d28d9' }}>
              <User size={20} color="white" />
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Sub Header & Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Sub Navigation */}
        <Navbar bg="white" className="border-bottom py-0">
          <Container fluid className="px-5">
            <Nav>
              <Nav.Link as={RouterNavLink} to="/" className="py-3 px-1 me-4" style={({ isActive }) => isActive ? { borderColor: '#6d28d9', color: '#6d28d9' } : {}}>
                Dashboard
              </Nav.Link>
              <Nav.Link as={RouterNavLink} to="/" className="py-3 px-1 me-4" active>
                Manage B2B organizations
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        {/* Main Content Area */}
        <main className="flex-grow-1 p-4 p-lg-5">
          <Container fluid className="px-lg-4">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}