import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  // Sync user profile on mount if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
        }
      }
      
      // Load admin state if adminToken exists
      if (adminToken) {
        try {
          // Verify admin credentials remain valid
          // We can parse payload from JWT directly for convenience
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            adminLogout();
          } else {
            setAdmin({
              id: payload.id,
              username: payload.username,
              email: payload.email
            });
          }
        } catch (err) {
          console.error('Error loading admin session:', err);
          adminLogout();
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [token, adminToken]);

  // Customer Login
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  // Customer Register
  const register = async (name, email, phone, password, confirmPassword) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, confirmPassword })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  // Customer Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Admin Login
  const adminLogin = async (username, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('adminToken', data.token);
      setAdminToken(data.token);
      setAdmin(data.admin);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        adminToken,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
