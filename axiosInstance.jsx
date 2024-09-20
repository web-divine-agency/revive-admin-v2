// src/axiosInstance.js
import axios from 'axios';
import { useContext } from 'react';
import {AuthContext} from './src/components/Authentication/authContext';
import {getCookie} from './src/components/Authentication/getCookie'
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom'; 

const axiosInstance = axios.create({
    baseURL: 'https://revive.imseoninja.com/api',
});

let isRefreshing = false;
let refreshUser = []

const onRefresh = (accessToken) => {
  refreshUser.forEach(callback => callback(accessToken));
  refreshUser = [];
}

const addUser = (callback) => {
    refreshUser.push(callback);
}

// Request interceptor to include the token in every request
axiosInstance.interceptors.request.use((config) => {
    const token = getCookie('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const showSessionExpiredPopup = (navigate) => {
    Swal.fire({
        title: 'Session Expired',
        text: 'Your session has expired. You will be redirected to the login page.',
        icon: 'warning',
        timer: 5000, // Wait for 5 seconds before redirecting
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(() => {
        navigate('/'); // Redirect to login after the popup
    });
};

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const navigate = useNavigate(); 
        const refreshToken = getCookie('refreshToken');
       if (!isRefreshing) {
            isRefreshing = true;
            
        try {
            const response = await axiosInstance.post('/refresh-token', {refreshToken} );
            const { accessToken } = response.data;

            document.cookie = `accessToken=${accessToken}; Path=/; `;
            onRefresh(accessToken);
            isRefreshing = false;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            useContext(AuthContext).logout();
            showSessionExpiredPopup(navigate); // Log out on refresh token failure
            return Promise.reject(refreshError);
        }
    }
    return new Promise((resolve) => {
      addUser((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
      });
  });
}

});

export default axiosInstance;
