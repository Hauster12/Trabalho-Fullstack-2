import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import ImovelDetails from './pages/ImovelDetails';
import LoginCliente from './pages/LoginCliente';
import CadastroCliente from './pages/CadastroCliente';
import MinhasPropostas from './pages/MinhasPropostas';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminImoveis from './pages/AdminImoveis';
import AdminPropostas from './pages/AdminPropostas';
import AdminAgenda from './pages/AdminAgenda';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imovel/:id" element={<ImovelDetails />} />
          <Route path="/login" element={<LoginCliente />} />
          <Route path="/cadastro" element={<CadastroCliente />} />
          <Route path="/minhas-propostas" element={<MinhasPropostas />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/imoveis" element={<AdminImoveis />} />
          <Route path="/admin/propostas" element={<AdminPropostas />} />
          <Route path="/admin/agenda" element={<AdminAgenda />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
