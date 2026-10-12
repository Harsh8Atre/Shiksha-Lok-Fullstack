import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        const userData = res?.data?.user || res?.user || res?.data;
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const payload = res?.data || res;
      const authToken = payload?.token;
      const authUser = payload?.user;
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
      }
      if (authUser) {
        setUser(authUser);
      }
      return payload;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      const payload = res?.data || res;
      const authToken = payload?.token;
      const authUser = payload?.user;
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
      }
      if (authUser) {
        setUser(authUser);
      }
      return payload;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const updateUser = async (data) => {
    try {
      if (user?._id) {
        const res = await userService.updateUser(user._id, data);
        const updated = res?.data || res;
        setUser(updated);
        return updated;
      }
      setUser((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setUser((prev) => ({ ...prev, ...data }));
      throw err;
    }
  };

  const value = { user, token, loading, error, login, register, logout, updateUser };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthContext;
