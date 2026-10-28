import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, LogIn, CheckSquare, Square } from 'lucide-react';

export default function LoginCliente() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(true);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { loginClienteSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post('/auth/cliente/login', { email, senha });
      const { cliente, clienteKey, token } = response.data;

      // Salvar UUID no localStorage se "Manter Conectado" estiver marcado (Requisito 5)
      loginClienteSession(cliente, clienteKey, token, manterConectado);

      navigate('/');
    } catch (err) {
      console.error('Erro no login:', err);
      setErro(err.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main class="flex-1 flex items-center justify-center p-4 py-12">
        <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8">
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Building2 class="w-7 h-7" />
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dados de Acesso do Cliente
            </h2>
            <p class="text-xs text-gray-500 mt-1">Informe seu e-mail e senha para prosseguir</p>
          </div>

          {erro && (
            <div class="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-medium mb-5">
              {erro}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1.5">Seu e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1.5">Senha de Acesso</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div class="flex items-center justify-between text-xs font-medium text-gray-600">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={manterConectado}
                  onChange={(e) => setManterConectado(e.target.checked)}
                  class="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                />
                <span>Manter Conectado</span>
              </label>

              <a href="#" onClick={(e) => { e.preventDefault(); alert('Utilize a senha de teste: 123456'); }} class="text-orange-600 hover:underline">
                Esqueceu sua senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={carregando}
              class="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn class="w-4 h-4" />
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-gray-500">
            Ainda não possui conta?{' '}
            <Link to="/cadastro" class="text-orange-600 font-bold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
