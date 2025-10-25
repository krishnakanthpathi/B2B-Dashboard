import { useState } from 'react';
import { updateOrganization } from '../services/api';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Edit } from 'lucide-react';
import FormInput from './FormInput';

export default function OrgTabBasic({ org, onOrgUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Updated state to match the complete Organization model
  const [formData, setFormData] = useState({
    name: org.name || '',
    email: org.email || '',
    slug: org.slug || '',
    contact: org.contact || '',
    primaryAdminName: org.primaryAdminName || '',
    supportEmail: org.supportEmail || '',
    maxCoordinators: org.maxCoordinators || 5, // Default from screenshot
    timezone: org.timezone || 'India Standard Time', // Default from screenshot
    language: org.language || 'English', // Default from screenshot
    website: org.website || '',
    primaryAdminEmail: org.primaryAdminEmail || '',
    phone: org.phone || '',
    region: org.region || 'Asia/Colombo', // Default from screenshot
    altPhone: org.altPhone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure numeric values are sent as numbers
      const dataToSend = {
        ...formData,
        maxCoordinators: parseInt(formData.maxCoordinators, 10) || 0,
      };

      await updateOrganization(org.id, dataToSend); // Use dataToSend
      setIsEditing(false);
      onOrgUpdate(); // This re-fetches the org data in the parent component
    } catch (error) { 
      console.error('Failed to update organization', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border">
      <Form onSubmit={handleSubmit}>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
          <h2 className="h5 mb-0">Profile</h2>
          {!isEditing ? (
            <Button variant="light" className="rounded-circle p-2" onClick={() => setIsEditing(true)}>
              <Edit size={20} />
            </Button>
          ) : (
            <div>
              <Button variant="light" onClick={() => setIsEditing(false)} className="me-3" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="violet" type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                )}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body className="p-4">
          <fieldset className="mb-4">
            <legend className="h6 mb-3">Organization details</legend>
            <Row className="g-3">
              <Col md={6}>
                <FormInput label="Organization name" id="name" name="name"
                  value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Organization SLUG" id="slug" name="slug"
                  value={formData.slug} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Organization Email" id="email" name="email" type="email"
                  value={formData.email} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Organization Contact" id="contact" name="contact" type="tel"
                  value={formData.contact} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
            </Row>
          </fieldset>
          
          <fieldset className="mb-4">
            <legend className="h6 mb-3">Contact details</legend>
            <Row className="g-3">
              <Col md={6}>
                <FormInput label="Primary Admin name" id="primaryAdminName" name="primaryAdminName"
                  value={formData.primaryAdminName} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Primary Admin Mail-id" id="primaryAdminEmail" name="primaryAdminEmail" type="email"
                  value={formData.primaryAdminEmail} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Support Email ID" id="supportEmail" name="supportEmail" type="email"
                  value={formData.supportEmail} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Phone no" id="phone" name="phone" type="tel"
                  value={formData.phone} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
              <Col md={6}>
                <FormInput label="Alternative Phone no" id="altPhone" name="altPhone" type="tel"
                  value={formData.altPhone} onChange={handleInputChange} disabled={!isEditing}
                />
              </Col>
            </Row>
          </fieldset>

          <fieldset className="mb-4">
            <legend className="h6 mb-3">Settings</legend>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="maxCoordinators">
                  <Form.Label className="mb-1_5 small fw-medium">Maximum Allowed Coordinators</Form.Label>
                  <Form.Select name="maxCoordinators" value={formData.maxCoordinators} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="5">Upto 5 Coordinators</option>
                    <option value="10">Upto 10 Coordinators</option>
                    <option value="25">Upto 25 Coordinators</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="timezone">
                  <Form.Label className="mb-1_5 small fw-medium">Timezone</Form.Label>
                  <Form.Select name="timezone" value={formData.timezone} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="India Standard Time">India Standard Time</option>
                    <option value="Pacific Standard Time">Pacific Standard Time</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="language">
                  <Form.Label className="mb-1_5 small fw-medium">Language</Form.Label>
                  <Form.Select name="language" value={formData.language} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="region">
                  <Form.Label className="mb-1_5 small fw-medium">Region</Form.Label>
                  <Form.Select name="region" value={formData.region} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="Asia/Colombo">Asia/Colombo</option>
                    <option value="America/New_York">America/New_York</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </fieldset>

          <fieldset>
            <legend className="h6 mb-3">Official website URL</legend>
            <Row><Col md={6}>
              <FormInput label="Website URL" id="website" name="website"
                value={formData.website} onChange={handleInputChange} disabled={!isEditing}
              />
            </Col></Row>
          </fieldset>
        </Card.Body>
      </Form>
    </Card>
  );
}

