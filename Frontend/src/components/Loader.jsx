import { Spinner } from 'react-bootstrap';

const Loader = ({ height = '300px' }) => (
  <div 
    className="d-flex justify-content-center align-items-center" 
    style={{ minHeight: height }}
  >
    <Spinner animation="border" variant="primary" />
  </div>
);

export default Loader;
