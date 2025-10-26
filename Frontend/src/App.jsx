import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ManageOrganizations from './pages/ManageOrganizations';
import OrganizationDetail from './pages/OrganizationDetail';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage-b2b" element={<ManageOrganizations />} />
        <Route path="/organization/:id" element={<OrganizationDetail />} />
      </Routes>
    </Layout>
  );
}