import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// 'uploadImage' service is no longer needed
import { getOrganizationById, updateOrganization } from '../services/api'; 
import { Card, Tabs, Tab, Button, Form, Spinner } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusPill from '../components/StatusPill';
import OrgTabBasic from '../components/OrgTabBasic';
import OrgTabUsers from '../components/OrgTabUsers';
import Loader from '../components/Loader';
import RightModal from '../components/RightModal';
import { Mail, Phone, Globe, Building, Camera } from 'lucide-react'; 

// CSS from the previous step remains the same.
// Add this to your main CSS file.
/*
.profile-image-container {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
}
.profile-image-container .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 0.25rem;
}
.profile-image-container:hover .overlay {
  opacity: 1;
}
.profile-image-container .overlay.loading {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.8);
}
*/

export default function OrganizationDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState('basic');

  // State for Change Status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  
  // State and Ref for image upload
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Renamed state
  const fileInputRef = useRef(null);

  useEffect(() => { fetchData() }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const orgResponse = await getOrganizationById(id);
      setOrg(orgResponse.data);
      setCurrentStatus(orgResponse.data.status || 'Inactive');
    } catch (error) { 
      console.error('Failed to fetch organization details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusModalOpen = () => {
    setCurrentStatus(org.status || 'Inactive');
    setIsStatusModalOpen(true);
  };

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    setIsSubmittingStatus(true);
    try {
      await updateOrganization(id, { status: currentStatus });
      await fetchData(); 
      setIsStatusModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // --- Image Upload Handlers (MODIFIED) ---

  // 1. Triggers the hidden file input
  const handleImageClick = () => {
    if (isUploadingImage) return; // Prevent click during upload
    fileInputRef.current.click();
  };

  // 2. Handles file selection, converts to Data URL, and updates
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (e.g., limit to 2MB) - IMPORTANT for Data URLs
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large! Please select an image under 10MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => {
      setIsUploadingImage(true);
    };

    reader.onerror = () => {
      console.error('Failed to read file');
      alert('Failed to read file. Please try again.');
      setIsUploadingImage(false);
    };

    // This runs when the file is successfully read
    reader.onloadend = async () => {
      const dataUrl = reader.result; // This is the Base64 string
      
      try {
        // Update the organization with the Data URL
        await updateOrganization(id, { img: dataUrl });
        
        // Refresh data to show the new image
        await fetchData();
      } catch (error) {
        console.error('Failed to update organization with new image:', error);
        alert('Failed to save image. Please try again.');
      } finally {
        setIsUploadingImage(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      }
    };

    // Start reading the file
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <Loader height="80vh" />;
  }

  if (!org) {
    return <div className="text-center">Organization not found.</div>;
  }

  const breadcrumbItems = [
    { name: 'Manage B2B organizations', link: '/' },
    { name: 'Organization details' },
  ];

  return (
    <>
      {/* Include the CSS styles (e.g., inline or in your stylesheet) */}
      <style>{`
        .profile-image-container{position:relative;width:80px;height:80px;cursor:pointer}.profile-image-container .overlay{position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);color:#fff;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease-in-out;border-radius:.25rem}.profile-image-container:hover .overlay{opacity:1}.profile-image-container .overlay.loading{opacity:1;background-color:rgba(255,255,255,.8)}
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <Card className="shadow-sm border mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex">
              
              {/* --- Image with Hover-to-Upload --- */}
              <div 
                className="profile-image-container me-4"
                onClick={handleImageClick}
                title="Change organization logo"
              >
                {org.img ? (
                  <img
                    src={org.img} // This will now work with Data URLs
                    alt={`${org.name} logo`}
                    className="rounded"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6' }}>
                    <Building size={40} className="text-secondary" />
                  </div>
                )}

                {/* Overlay shown on hover or during loading */}
                <div className={`overlay ${isUploadingImage ? 'loading' : ''}`}>
                  {isUploadingImage ? (
                    <Spinner animation="border" size="sm" variant="primary" />
                  ) : (
                    <Camera size={24} />
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/png, image/jpeg, image/gif"
              />

              <div>
                <h1 className="h3 mb-2">{org.name}</h1>
                <div className="d-flex text-muted small">
                  <span className="d-flex align-items-center me-4">
                    <Mail size={16} className="me-2" />
                    {org.email || 'gitam@gitam.in'}
                  </span>
                  <span className="d-flex align-items-center me-4">
                    <Phone size={16} className="me-2" />
                    {org.phone || '91 - 9676456543'}
                  </span>
                  <span className="d-flex align-items-center">
                    <Globe size={16} className="me-2" />
                    {org.website || 'Gitam.edu'}
                  </span>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <StatusPill status={org.status || 'Inactive'} />
              <Button 
                variant="link" 
                className="text-decoration-none fw-medium ms-2" 
                style={{color: '#6d28d9'}}
                onClick={handleStatusModalOpen}
              >
                Change status
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Tabs
        id="org-details-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
      >
        <Tab eventKey="basic" title="Basic details">
          <OrgTabBasic org={org} onOrgUpdate={fetchData} />
        </Tab>
        <Tab eventKey="users" title="Users">
          <OrgTabUsers orgId={id} />
        </Tab>
      </Tabs>

      {/* -- Change Status Modal -- */}
      <RightModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change Status"
        onSubmit={handleChangeStatus}
        isSubmitting={isSubmittingStatus}
        submitText="Save"
      >
        <Form.Group controlId="status">
          <Form.Label className="mb-1_5 small fw-medium">
            Set organization status
          </Form.Label>
          <Form.Select
            name="status"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </Form.Group>
      </RightModal>
    </>
  );
}