import { Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import { Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <Breadcrumb className="mb-4">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        <Home size={16} />
      </Breadcrumb.Item>
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={item.link ? Link : 'span'}
          linkProps={item.link ? { to: item.link } : {}}
          active={!item.link}
        >
          {item.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}