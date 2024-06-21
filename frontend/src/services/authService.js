import axios from 'axios';

const API_URL = '/api/token/';

const login = (username, password) => {
    return axios.post(API_URL, { username, password })
        .then(response => {
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('token');
};

export default {
    login,
    logout
};
