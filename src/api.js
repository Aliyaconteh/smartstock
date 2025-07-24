// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://shop-backend-1-nhkz.onrender.com/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

// ✅ Set or remove Authorization header globally
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// ✅ API functions (explicit exports)
export const getProducts = () => api.get('products/');
export const login = (username, password) =>
    api.post('token/', { username, password });
export const createProduct = (productData) =>
    api.post('products/', productData);
export const updateProduct = (id, productData) =>
    api.put(`products/${id}/`, productData);
export const deleteProduct = (id) =>
    api.delete(`products/${id}/`);

export default api;
