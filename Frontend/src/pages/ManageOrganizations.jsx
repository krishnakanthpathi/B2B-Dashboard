import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizations, createOrganization, deleteOrganization } from '../services/api';
import { Table, Button, Card, InputGroup, FormControl } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import RightModal from '../components/RightModal';
import FormInput from '../components/FormInput';
import StatusPill from '../components/StatusPill';
import Loader from '../components/Loader';
import { Plus, Search, Eye, Trash2, Filter, Building } from 'lucide-react';

export default function ManageOrganizations() {
    const [orgs, setOrgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', slug: '', email: '', contact: '',
    });

    useEffect(() => { fetchOrganizations() }, []);

    const fetchOrganizations = async () => {
        setIsLoading(true);
        try {
            const response = await getOrganizations();
            setOrgs(response.data);
        } catch (error) { 
            console.error('Failed to fetch organizations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // CHANGED: Send the full formData object which matches the model
            await createOrganization(formData);
            
            fetchOrganizations();
            setIsModalOpen(false);
            setFormData({ name: '', slug: '', email: '', contact: '' });
        } catch (error) { 
            console.error('Failed to create organization:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete handler: calls API then removes from local state
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this organization?')) return;
        try {
            await deleteOrganization(id);
            setOrgs(prev => prev.filter(o => o.id !== id));
        } catch (error) {
            console.error('Failed to delete organization:', error);
        }
    };

    return (
        <>
            <Breadcrumbs items={[{ name: 'Manage B2B organizations' }]} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">B2B organizations</h1>
                <div className="d-flex align-items-center">
                    <Button variant="violet" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} className="me-2" />
                        Add organization
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                    <h2 className="h5 mb-0">Organizations</h2>
                    <Button variant="link" className="text-decoration-none text-secondary">
                        <Filter size={16} className="me-1_5" />
                        Status
                    </Button>
                </Card.Header>
                
                {isLoading ? (
                    <Loader />
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 px-3">Sr. No</th>
                                <th className="py-3 px-3">Organizations</th>
                                <th className="py-3 px-3">Pending requests</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orgs.map((org, index) => (
                                <tr key={org.id}>
                                    <td className="px-3">{index + 1}</td>
                                    <td className="px-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '32px', height: '32px', backgroundColor: '#ede9fe'}}>
                                                <Building size={16} color="#6d28d9" />
                                            </div>
                                            <span className="fw-medium">{org.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3">45 pending requests</td>
                                    {/* Now correctly displays the status from the data */}
                                    <td className="px-3"><StatusPill status={org.status || 'Inactive'} /></td>
                                    <td className="px-3">
                                        <Button variant="link" as={Link} to={`/organization/${org.id}`} className="text-secondary p-2">
                                            <Eye size={18} />
                                        </Button>
                                        <Button variant="link" className="text-secondary p-2" onClick={() => handleDelete(org.id)} aria-label="Delete organization">
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            <RightModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Add Organization"
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitText="Add"
            >
                <FormInput
                    label="Name of the organization" id="name" name="name"
                    value={formData.name} onChange={handleInputChange} placeholder="Text" required
                    className="mb-4"
                />
                <FormInput
                    label="Slug" id="slug" name="slug"
                    value={formData.slug} onChange={handleInputChange} placeholder="Type here"
                    className="mb-4"
                />
                <FormInput
                    label="Organization mail" id="email" name="email" type="email"
                    value={formData.email} onChange={handleInputChange} placeholder="Type here"
                    className="mb-4"
                />
                <FormInput
                    label="Contact" id="contact" name="contact" type="tel"
                    value={formData.contact} onChange={handleInputChange} placeholder="Type here"
                />
            </RightModal>
        </>
    );
}
