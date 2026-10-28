import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserPlus, Mail, KeyRound, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function CadastroCliente() {
  const [step, setStep] = useState(1); // 1 = Dados iniciais, 2 = Digitar código de verificação
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('Pelotas');
  const [codigo, setCodigo] = useState('');
  const [devCodeHelper, setDevCodeHelper] = useState(null);

  const [erro, setErro] = useState(null);
  const [sucessoMsg, setSucessoMsg] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { loginClienteSession } = useContext(AuthContext);
  const navigate = useNavigate();

  // Passo 1: Enviar código de verificação para o e-mail
  const handleSendCodeSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post('/auth/cliente/send-code', { email });
      setSucessoMsg(response.data.message);
      if (response.data.devCode) {
        setDevCodeHelper(response.data.devCode);
      }
      setStep(2);
    } catch (err) {
      console.error('Erro ao enviar código de verificação:', err);
      setErro(err.response?.data?.error || 'Erro ao enviar código de verificação.');
    } finally {
      setCarregando(false);
    }
  };

  // Passo 2: Validar o código e concluir o cadastro do cliente
  const handleRegisterWithCodeSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post('/auth/cliente/register', {
        nome,
        email,
        senha,
        telefone,
        cidade,
        codigo
      });

      const { cliente, clienteKey, token } = response.data;
      loginClienteSession(cliente, clienteKey, token, true);
      navigate('/');
    } catch (err) {
      console.error('Erro ao verificar código:', err);
      setErro(err.response?.data?.error || 'Código de verificação incorreto ou expirado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main class="flex-1 flex items-center justify-center p-4 py-12">
        <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8">
          {step === 1 ? (
            /* Passo 1: Formulário com envio de código por e-mail */
            <div>
              <div class="text-center mb-8">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <UserPlus class="w-7 h-7" />
                </div>
                <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Criar Conta de Cliente
                </h2>
                <p class="text-xs text-gray-500 mt-1">Preencha seus dados para receber o código de verificação por e-mail</p>
              </div>

              {erro && (
                <div class="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-medium mb-5">
                  {erro}
                </div>
              )}

              <form onSubmit={handleSendCodeSubmit} class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria Souza"
                    required
                    class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Seu E-mail (Enviar Verificação)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@gmail.com"
                    required
                    class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Senha de Acesso</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    class="w-full bg-slate-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Telefone</label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(53) 99999-8888"
                      class="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cidade</label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Pelotas"
                      class="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mail class="w-4 h-4" />
                  {carregando ? 'Enviando Código...' : 'Enviar Código de Verificação'}
                </button>
              </form>

              <div class="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-gray-500">
                Já possui cadastro?{' '}
                <Link to="/login" class="text-blue-600 font-bold hover:underline">
                  Entrar na sua conta
                </Link>
              </div>
            </div>
          ) : (
            /* Passo 2: Digitar Código de Verificação Enviado por E-mail */
            <div>
              <div class="text-center mb-6">
                <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <KeyRound class="w-7 h-7" />
                </div>
                <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verificação de E-mail
                </h2>
                <p class="text-xs text-gray-600 mt-2">
                  Enviamos um código de 6 dígitos para o e-mail: <br />
                  <strong class="text-slate-800">{email}</strong>
                </p>
              </div>

              {sucessoMsg && (
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-medium mb-4 flex items-center gap-1.5">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                  {sucessoMsg}
                </div>
              )}

              {devCodeHelper && (
                <div class="bg-purple-50 border border-purple-200 text-purple-900 p-3 rounded-lg text-xs mb-4 text-center font-mono font-bold">
                  🔑 [Dev Helper - Teste Local] Código: <span class="text-purple-700 text-base">{devCodeHelper}</span>
                </div>
              )}

              {erro && (
                <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium mb-4">
                  {erro}
                </div>
              )}

              <form onSubmit={handleRegisterWithCodeSubmit} class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-2 text-center">
                    Digite o Código de 6 Dígitos
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="123456"
                    required
                    class="w-full bg-slate-50 border-2 border-amber-400 rounded-xl px-4 py-3 text-center text-2xl font-extrabold tracking-widest text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  {carregando ? 'Confirmando...' : 'Confirmar e Finalizar Cadastro'}
                </button>
              </form>

              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-gray-500">
                <button
                  onClick={() => setStep(1)}
                  class="text-gray-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                >
                  <ArrowLeft class="w-3.5 h-3.5" /> Corrigir E-mail
                </button>

                <button
                  onClick={handleSendCodeSubmit}
                  class="text-amber-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw class="w-3.5 h-3.5" /> Reenviar Código
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
