import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';

/**
 * A reusable right-hand sidebar component for forms.
 * It includes a sticky footer with "Cancel" and "Submit" buttons.
 * * @param {boolean} isOpen - Controls if the sidebar is open.
 * @param {function} onClose - Function to call when closing the sidebar.
 * @param {string} title - The text to display in the header.
 * @param {function} onSubmit - The function to call when the form is submitted.
 * @param {boolean} isSubmitting - Disables the submit button and shows a spinner.
 * @param {React.ReactNode} children - The form fields to render inside the body.
 * @param {string} submitText - The text for the submit button (default: "Add").
 */
export default function RightModal({ 
  isOpen, 
  onClose, 
  title, 
  onSubmit, 
  isSubmitting = false, 
  children,
  submitText = "Add"
}) {
  return (
    <Offcanvas show={isOpen} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title as="h2" className="fs-5 fw-semibold">
          {title}
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column p-0">
        <Form onSubmit={onSubmit} className="d-flex flex-column flex-grow-1">
          {/* Form fields go here */}
          <div className="flex-grow-1 p-4">
            {children}
          </div>
          
          {/* Sticky Footer */}
          <div className="mt-auto p-4 border-top bg-white d-flex justify-content-end">
            <Button variant="light" onClick={onClose} className="me-3" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="violet" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              ) : null}
              {isSubmitting ? 'Saving...' : submitText}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
