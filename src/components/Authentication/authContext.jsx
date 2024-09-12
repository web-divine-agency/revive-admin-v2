// authContext.js
import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './getCookie'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        const token = getCookie('accessToken');

        if (token) {
            axiosInstance.get('/users')
                .then(response => {
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout function

    const logout = () => {
        document.cookie = 'accessToken=; Max-Age=0; Path=/; ';
        document.cookie = 'refreshToken=; Max-Age=0; Path=/; ';
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;