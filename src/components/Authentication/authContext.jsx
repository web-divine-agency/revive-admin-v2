// authContext.js
import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import {getCookie} from './getCookie'

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

useEffect(() => {
    const handleBackButton = () => {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
        

      if (!accessToken) {
        navigate('/');
      }
    };
  
    window.addEventListener('popstate', handleBackButton);
  
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  

const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
};

  // Logout function

  const logout = async () => {
    try {
      document.cookie = 'accessToken=; Max-Age=0; Path=/;';
      document.cookie = 'refreshToken=; Max-Age=0; Path=/;';

      setUser(null);
      setIsAuthenticated(false);
  
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
        {children}
    </AuthContext.Provider>
);
};

export default AuthContext;