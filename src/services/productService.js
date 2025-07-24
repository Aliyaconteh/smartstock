import axios from 'axios';
import { getToken } from '../auth';

const API_URL = 'http://localhost:8000/api/products/';

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const fetchAllProducts = async () => {
    const res = await axios.get(API_URL, authHeader());
    return res.data;
};

export const fetchProductById = async (id) => {
    const res = await axios.get(`${API_URL}${id}/`, authHeader());
    return res.data;
};

export const addProduct = async (productData) => {
    return await axios.post(API_URL, productData, authHeader());
};

export const updateProduct = async (id, productData) => {
    return await axios.put(`${API_URL}${id}/`, productData, authHeader());
};
