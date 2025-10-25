import { Form } from 'react-bootstrap';

export default function FormInput({ label, id, ...props }) {
  return (
    <Form.Group controlId={id}>
      <Form.Label className="mb-1_5 small fw-medium">{label}</Form.Label>
      <Form.Control {...props} />
    </Form.Group>
  );
}