import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if your backend port is different
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Organization Endpoints ---
export const getOrganizations = () => apiClient.get('/organizations');
export const getOrganizationById = (id) => apiClient.get(`/organizations/${id}`);
export const createOrganization = (data) => apiClient.post('/organizations', data);
export const updateOrganization = (id, data) => apiClient.put(`/organizations/${id}`, data);
export const deleteOrganization = (id) => apiClient.delete(`/organizations/${id}`);

// --- Organization-Specific User Endpoints ---
export const getOrgUsers = (orgId) => apiClient.get(`/organizations/${orgId}/users`);
export const createOrgUser = (orgId, data) => apiClient.post(`/organizations/${orgId}/users`, data);

// --- Global User Endpoints ---
export const getAllUsers = () => apiClient.get('/users');
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

export default apiClient;