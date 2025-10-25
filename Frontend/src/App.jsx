import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ManageOrganizations from './pages/ManageOrganizations';
import OrganizationDetail from './pages/OrganizationDetail';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ManageOrganizations />} />
        <Route path="/organization/:id" element={<OrganizationDetail />} />
      </Routes>
    </Layout>
  );
}