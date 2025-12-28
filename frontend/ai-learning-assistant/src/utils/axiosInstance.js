import axios from 'axios';
import { BASE_URL } from './apiPaths';


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000, // 80 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
    },
});

// request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const accesToken = localStorage.getItem('token');
        if (accesToken) {
            config.headers['Authorization'] = `Bearer ${accesToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                console.log('Server error occurred. Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.log('Request timeout. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;