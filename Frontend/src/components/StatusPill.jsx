import { Badge } from 'react-bootstrap';

export default function StatusPill({ status }) {
  const variants = {
    Active: 'bg-status-active',
    Blocked: 'bg-status-blocked',
    Inactive: 'bg-status-inactive',
    Admin: 'bg-status-active',
    'Co-ordinator': 'bg-status-coordinator',
  };

  const variant = variants[status] || variants['Inactive'];

  return (
    <Badge pill className={`text-decoration-none ${variant} fw-medium d-inline-flex align-items-center`}>
      <span className="badge-dot"></span>
      {status}
    </Badge>
  );
}