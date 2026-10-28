import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Clock, CheckCircle, XCircle, ArrowLeft, Building2 } from 'lucide-react';

export default function MinhasPropostas() {
  const { cliente, clienteKey } = useContext(AuthContext);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPropostas() {
      if (!clienteKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/propostas/cliente/${clienteKey}`);
        setPropostas(response.data);
      } catch (err) {
        console.error('Erro ao buscar propostas do cliente:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPropostas();
  }, [clienteKey]);

  if (!cliente) {
    return (
      <div class="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main class="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <div class="bg-white p-8 rounded-2xl shadow border border-slate-200">
            <h2 class="text-xl font-bold text-slate-800 mb-2">Acesso Restrito ao Cliente</h2>
            <p class="text-sm text-gray-500 mb-6">Você precisa estar logado para visualizar suas propostas enviadas.</p>
            <Link to="/login" class="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow hover:bg-orange-700">
              Fazer Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Aceita':
        return (
          <span class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle class="w-3.5 h-3.5 text-emerald-600" /> Proposta Aceita
          </span>
        );
      case 'Recusada':
        return (
          <span class="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle class="w-3.5 h-3.5 text-rose-600" /> Proposta Recusada
          </span>
        );
      case 'Em Analise':
        return (
          <span class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
            <Clock class="w-3.5 h-3.5 text-amber-600" /> Em Análise
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
            <Clock class="w-3.5 h-3.5 text-slate-500" /> Pendente
          </span>
        );
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main class="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        <div class="mb-6 flex items-center justify-between">
          <Link to="/" class="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-blue-600">
            <ArrowLeft class="w-4 h-4" /> Voltar para os imóveis
          </Link>
        </div>

        {/* Título com marcação em destaque */}
        <div class="mb-8 border-b-2 border-slate-200 pb-4">
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Listagem de <span class="underline decoration-orange-500 decoration-4 underline-offset-8">Minhas Propostas</span>
          </h1>
          <p class="text-xs text-gray-500 mt-2 font-medium">
            Acompanhe o status e a resposta da imobiliária para cada proposta enviada.
          </p>
        </div>

        {loading ? (
          <div class="text-center py-16 text-gray-400">Carregando propostas...</div>
        ) : propostas.length === 0 ? (
          <div class="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <FileText class="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 class="text-lg font-bold text-slate-800">Nenhuma proposta enviada ainda</h3>
            <p class="text-xs text-gray-500 mt-1 mb-6">Explore nossos imóveis em destaque e faça sua primeira proposta.</p>
            <Link to="/" class="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow">
              Explorar Imóveis
            </Link>
          </div>
        ) : (
          <div class="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider border-b border-slate-200">
                    <th class="py-3.5 px-6 font-bold">Imóvel</th>
                    <th class="py-3.5 px-4 font-bold text-center">Foto</th>
                    <th class="py-3.5 px-6 font-bold">Proposta</th>
                    <th class="py-3.5 px-6 font-bold">Resposta da Imobiliária</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {propostas.map((item) => (
                    <tr key={item.id} class="hover:bg-slate-50 transition-colors">
                      {/* Dados do Imóvel */}
                      <td class="py-4 px-6 align-top">
                        <Link to={`/imovel/${item.imovel?.id}`} class="font-bold text-slate-900 hover:text-blue-600 block line-clamp-1">
                          {item.imovel?.titulo || 'Imóvel indisponível'}
                        </Link>
                        <span class="text-xs text-gray-500 block mt-1">
                          {item.imovel?.cidade} - {item.imovel?.bairro}
                        </span>
                        <span class="text-xs font-semibold text-blue-700 block mt-1">
                          Preço anúncio: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.imovel?.preco || 0)}
                        </span>
                      </td>

                      {/* Foto */}
                      <td class="py-4 px-4 align-top text-center">
                        <img
                          src={item.imovel?.fotoUrl}
                          alt="Foto"
                          class="w-24 h-16 object-cover rounded-lg shadow-xs mx-auto border border-slate-200"
                        />
                      </td>

                      {/* Proposta Enviada pelo Cliente */}
                      <td class="py-4 px-6 align-top">
                        <div class="font-bold text-slate-800">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorProposta)}
                        </div>
                        <p class="text-xs text-gray-600 mt-1 italic leading-relaxed">
                          "{item.mensagem}"
                        </p>
                        <span class="text-[11px] text-gray-400 block mt-2">
                          Enviado em: {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </td>

                      {/* Resposta do Admin / Corretor */}
                      <td class="py-4 px-6 align-top">
                        <div class="mb-2">
                          {renderStatusBadge(item.status)}
                        </div>
                        {item.respostaAdmin ? (
                          <div class="bg-blue-50/70 border border-blue-100 p-3 rounded-lg text-xs text-slate-800 leading-relaxed font-medium">
                            {item.respostaAdmin}
                            {item.respondidoEm && (
                              <span class="block text-[10px] text-slate-400 font-normal mt-1.5 border-t border-blue-100 pt-1">
                                Respondido em: {new Date(item.respondidoEm).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span class="text-xs italic text-gray-400">
                            Aguardando análise da equipe...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
