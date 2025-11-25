import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('admin_token', token);
};

// Remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('admin_token');
};

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Events API
export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await apiClient.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await apiClient.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await apiClient.delete(`/events/${eventId}`);
  return response.data;
};

// Site Content API
export const getSiteContent = async () => {
  const response = await apiClient.get('/site-content');
  return response.data;
};

export const updateSiteContent = async (contentData) => {
  const response = await apiClient.put('/site-content', contentData);
  return response.data;
};

// Team Members API
export const getTeamMembers = async () => {
  const response = await apiClient.get('/team');
  return response.data;
};

export const createTeamMember = async (memberData) => {
  const response = await apiClient.post('/team', memberData);
  return response.data;
};

export const updateTeamMember = async (memberId, memberData) => {
  const response = await apiClient.put(`/team/${memberId}`, memberData);
  return response.data;
};

export const deleteTeamMember = async (memberId) => {
  const response = await apiClient.delete(`/team/${memberId}`);
  return response.data;
};

// Gallery API
export const getGalleryItems = async () => {
  const response = await apiClient.get('/gallery');
  return response.data;
};

export const createGalleryItem = async (itemData) => {
  const response = await apiClient.post('/gallery', itemData);
  return response.data;
};

export const updateGalleryItem = async (itemId, itemData) => {
  const response = await apiClient.put(`/gallery/${itemId}`, itemData);
  return response.data;
};

export const deleteGalleryItem = async (itemId) => {
  const response = await apiClient.delete(`/gallery/${itemId}`);
  return response.data;
};

// Videos API
export const getVideos = async () => {
  const response = await apiClient.get('/videos');
  return response.data;
};

export const createVideo = async (videoData) => {
  const response = await apiClient.post('/videos', videoData);
  return response.data;
};

export const updateVideo = async (videoId, videoData) => {
  const response = await apiClient.put(`/videos/${videoId}`, videoData);
  return response.data;
};

export const deleteVideo = async (videoId) => {
  const response = await apiClient.delete(`/videos/${videoId}`);
  return response.data;
};

// Admin Auth API
export const adminLogin = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(`${API}/admin/login`, formData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await apiClient.get('/admin/verify');
  return response.data;
};

export const updateAdmin = async (username, email) => {
  const response = await apiClient.put('/admin/update', { username, email });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put('/admin/change-password', { old_password: oldPassword, new_password: newPassword });
  return response.data;
};