import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [clienteKey, setClienteKey] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicialização: checar se existe UUID do cliente em LocalStorage (Requisito 5)
  useEffect(() => {
    async function checkSavedSession() {
      const savedKey = localStorage.getItem('clienteKey');
      if (savedKey) {
        try {
          const response = await api.get(`/auth/cliente/me/${savedKey}`);
          if (response.data && response.data.cliente) {
            setCliente(response.data.cliente);
            setClienteKey(response.data.clienteKey);
          }
        } catch (err) {
          console.warn('⚡ UUID do LocalStorage inválido ou expirado:', err.message);
          localStorage.removeItem('clienteKey');
        }
      }

      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (e) {
          localStorage.removeItem('adminUser');
        }
      }

      setLoading(false);
    }

    checkSavedSession();
  }, []);

  // Login de Cliente
  const loginClienteSession = (clienteData, uuid, token, manterConectado = true) => {
    setCliente(clienteData);
    setClienteKey(uuid);

    if (manterConectado) {
      localStorage.setItem('clienteKey', uuid);
      if (token) localStorage.setItem('token', token);
    }
  };

  // Logout de Cliente
  const logoutClienteSession = () => {
    setCliente(null);
    setClienteKey(null);
    localStorage.removeItem('clienteKey');
    localStorage.removeItem('token');
  };

  // Login de Admin
  const loginAdminSession = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    if (token) localStorage.setItem('adminToken', token);
  };

  // Logout de Admin
  const logoutAdminSession = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider
      value={{
        cliente,
        clienteKey,
        admin,
        loading,
        loginClienteSession,
        logoutClienteSession,
        loginAdminSession,
        logoutAdminSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
