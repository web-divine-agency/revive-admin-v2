// src/axiosInstance.js
import axios from 'axios';
import { useContext } from 'react';
import {AuthContext} from './src/components/Authentication/authContext';
import {getCookie} from './src/components/Authentication/getCookie'

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

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

       if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = getCookie('refreshToken');

        try {
            const response = await axiosInstance.post('/refresh-token', { token: refreshToken });
            const { accessToken } = response.data;

            document.cookie = `accessToken=${accessToken}; Path=/; `;
            onRefresh(accessToken);
            isRefreshing = false;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            useContext(AuthContext).logout();
            isRefreshing = false; // Log out on refresh token failure
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
