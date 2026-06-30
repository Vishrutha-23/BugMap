import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://bugmap-backend.onrender.com/api',
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getAllIssues = () => API.get('/issues');
export const getIssue = (id) => API.get(`/issues/${id}`);
export const reportIssue = (data) => API.post('/issues', data);
export const upvoteIssue = (id) => API.post(`/issues/${id}/upvote`);
export const updateStatus = (id, status) => API.patch(`/issues/${id}/status`, { status });
export const generateLetter = (id) => API.post(`/ai/complaint-letter/${id}`);