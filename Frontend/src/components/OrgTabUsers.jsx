import { useState, useEffect } from 'react';
import { getOrgUsers, createOrgUser, deleteUser, updateUser } from '../services/api';
import { Card, Table, Button, Form, Spinner } from 'react-bootstrap';
import StatusPill from './StatusPill';
import RightModal from './RightModal';
import FormInput from './FormInput';
import Loader from './Loader';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function OrgTabUsers({ orgId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for modals
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for forms
  const [currentUser, setCurrentUser] = useState(null); // For editing
  const [formData, setFormData] = useState({ // For adding
    name: '', 
    role: 'Admin',
  });

  useEffect(() => { 
    fetchUsers();
  }, [orgId]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getOrgUsers(orgId);
      setUsers(response.data);
    } catch (error) { 
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Modal Control ---
  const handleShowAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', role: 'Admin' }); // Reset add form
    setIsModalOpen(true);
  };

  const handleShowEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user); // Set user data for edit form
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // --- Form Handlers ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (modalMode === 'edit') {
      setCurrentUser(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (modalMode === 'edit') {
        // --- Edit Logic ---
        const { id, name, role } = currentUser;
        await updateUser(id, { name, role });
      } else {
        // --- Add Logic ---
        await createOrgUser(orgId, formData);
      }
      await fetchUsers(); // Refresh the user list
      handleCloseModal(); // Close the modal on success
    } catch (error) {
      console.error(`Failed to ${modalMode} user:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        await fetchUsers(); // Refresh list
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  // Determine which data to show in the modal's form
  const modalData = modalMode === 'edit' ? currentUser : formData;

  if (isLoading) {
    return <Loader height="30vh" />;
  }

  return (
    <>
      <Card className="shadow-sm border">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
          <h2 className="h5 mb-0">Users</h2>
          <Button variant="violet" size="sm" onClick={handleShowAddModal}>
            <Plus size={18} className="me-1_5" />
            Add user
          </Button>
        </Card.Header>

        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-3">Sr. No</th>
              <th className="py-3 px-3">User name</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="px-3">{index + 1}</td>
                <td className="px-3 fw-medium">{user.name}</td>
                <td className="px-3"><StatusPill status={user.role || 'Admin'} /></td>
                <td className="px-3">
                  <Button 
                    variant="link" 
                    className="text-secondary p-2"
                    onClick={() => handleShowEditModal(user)}
                  >
                    <Edit size={18} />
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-secondary p-2" 
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* --- Add/Edit User Modal --- */}
      <RightModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'edit' ? 'Edit User' : 'Add User'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText={modalMode === 'edit' ? 'Save Changes' : 'Add'}
      >
        {/* Render form only if data is ready */}
        {modalData && (
          <>
            <FormInput
              label="Name of the user"
              id="name"
              name="name"
              value={modalData.name}
              onChange={handleFormChange}
              placeholder="Type here"
              required
              className="mb-4"
            />
            
            <Form.Group controlId="role">
              <Form.Label className="mb-1_5 small fw-medium">Choose user role</Form.Label>
              <Form.Select 
                name="role" 
                value={modalData.role} 
                onChange={handleFormChange}
              >
                <option value="Admin">Admin</option>
                <option value="Co-ordinator">Co-ordinator</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
      </RightModal>
    </>
  );
}

