import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user'); // We will store user data here later
  if (user) {
    const { token } = JSON.parse(user);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;