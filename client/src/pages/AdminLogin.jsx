import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Building2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@imobisenac.com');
  const [senha, setSenha] = useState('123456');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { loginAdminSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post('/auth/admin/login', { email, senha });
      const { admin, token } = response.data;
      loginAdminSession(admin, token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erro no login admin:', err);
      setErro(err.response?.data?.error || 'Credenciais de administrador incorretas.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-amber-200">
            <Building2 class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admin: ImobiSelect
          </h2>
          <p class="text-xs text-gray-500 mt-1">Área Restrita para Gestão do Sistema</p>
        </div>

        {erro && (
          <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleAdminLogin} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow flex items-center justify-center gap-2"
          >
            <ShieldCheck class="w-4 h-4" />
            {carregando ? 'Acessando...' : 'Entrar'}
          </button>
        </form>

        <div class="mt-6 text-center">
          <Link to="/" class="text-xs text-gray-500 hover:text-blue-600 font-semibold inline-flex items-center gap-1">
            <ArrowLeft class="w-3.5 h-3.5" /> Voltar ao Portal Público
          </Link>
        </div>
      </div>
    </div>
  );
}
