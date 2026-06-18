// frontend/src/utils/api.js
// Shared Axios instance used by all API calls in the frontend.
//
// Key settings:
//   baseURL        — read from VITE_API_URL so the same code works locally
//                    (http://localhost:5000) and in production (Render URL).
//   withCredentials — MUST be true so the browser sends the httpOnly JWT
//                    cookie that the backend sets on login/register.
//
// Usage: import api from '../utils/api'; then api.post(...)

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true, // sends httpOnly cookie (JWT) with every request
});

export default api;
