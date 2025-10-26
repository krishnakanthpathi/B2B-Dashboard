import { NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Bell, HelpCircle, User } from 'lucide-react';

// Define active style for NavLinks
const getActiveStyle = ({ isActive }) => ({
  // Adding a bottom border instead of just color for a clearer active state
  borderBottom: isActive ? '2px solid #6d28d9' : '2px solid transparent',
  color: isActive ? '#6d28d9' : 'inherit',
  fontWeight: isActive ? '500' : 'normal'
});

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Header */}
      <Navbar bg="white" expand="lg" className="border-bottom" sticky="top">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="bg-light px-3 py-2 me-4 text-secondary fw-bold">
            LOGO
          </Navbar.Brand>

          {/* Hamburger menu toggle for small screens */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          {/* /* Collapsible content */}
          <Navbar.Collapse id="responsive-navbar-nav ">
            <Nav className="ms-auto  mt-4 d-flex flex-row flex-lg-row align-items-center">
              {/* Added responsive margins (mt-2 on mobile, 0 on large) for spacing when collapsed */}
              <Button variant="light" className="rounded-circle p-2 me-lg-2 mt-2 mt-lg-0">
                <HelpCircle size={22} />
              </Button>
              <Button variant="light" className="rounded-circle p-2 me-lg-3 mt-2 mt-lg-0">
                <Bell size={22} />
              </Button>
              <Button 
                className="rounded-circle d-flex align-items-center justify-content-center mt-2 mt-lg-0" 
                style={{ width: '40px', height: '40px', backgroundColor: '#6d28d9' }}
              >
                <User size={20} color="white" />
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sub Header & Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto' }}>
        {/* Sub Navigation - Added overflow-auto for horizontal scrolling on mobile */}
        <Navbar bg="white" className="border-bottom py-0 overflow-auto">
          {/* Changed px-5 to px-4 for consistency */}
          <Container fluid className="px-4">
            {/* Added flex-nowrap to prevent links from wrapping */}
            <Nav className="flex-nowrap">
              <Nav.Link 
                as={RouterNavLink} 
                to="/" 
                end // 'end' prop ensures this only matches the exact root path
                className="py-3 px-1 me-4 text-nowrap" 
                style={getActiveStyle}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={RouterNavLink} 
                to="/manage-b2b" // Changed to a unique path
                className="py-3 px-1 me-4 text-nowrap" 
                style={getActiveStyle} // Applied consistent active styling
              >
                Manage B2B organizations
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        {/* Main Content Area */}
        <main className="flex-grow-1 p-4 p-lg-5" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Changed px-lg-4 to px-4 for consistency */}
          <Container fluid className="px-4">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}