import axios from 'axios';

const API_URL = 'http://localhost:8000/api/token/'; // Replace with your Django backend URL

export const loginUser = async (username, password) => {
    const response = await axios.post(API_URL, {
        username,
        password,
    });
    return response.data; // returns { access, refresh }
};
