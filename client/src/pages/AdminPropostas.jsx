import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Check, Edit3, Trash2, X, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminPropostas() {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposta, setSelectedProposta] = useState(null);
  const [respostaText, setRespostaText] = useState('');
  const [statusSelect, setStatusSelect] = useState('Aceita');
  const [saving, setSaving] = useState(false);

  const fetchPropostas = async () => {
    try {
      const response = await api.get('/propostas/admin/all');
      setPropostas(response.data);
    } catch (err) {
      console.error('Erro ao buscar propostas dos clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchPropostas();
  }, [admin, navigate]);

  const handleOpenRespondModal = (item) => {
    setSelectedProposta(item);
    setRespostaText(item.respostaAdmin || 'Ok. Aceitamos a proposta. Venha conversar conosco para formalizar!');
    setStatusSelect(item.status === 'Pendente' ? 'Aceita' : item.status);
  };

  const handleQuickAccept = async (id) => {
    try {
      await api.put(`/propostas/admin/respond/${id}`, {
        status: 'Aceita',
        respostaAdmin: 'Proposta aceita! Ficamos aguardando seu contato para assinatura.'
      });
      fetchPropostas();
    } catch (err) {
      alert('Erro ao aceitar proposta.');
    }
  };

  const handleDeleteProposta = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta proposta?')) return;
    try {
      await api.delete(`/propostas/admin/${id}`);
      fetchPropostas();
    } catch (err) {
      alert('Erro ao excluir proposta.');
    }
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!selectedProposta) return;
    setSaving(true);

    try {
      await api.put(`/propostas/admin/respond/${selectedProposta.id}`, {
        respostaAdmin: respostaText,
        status: statusSelect
      });
      setSelectedProposta(null);
      fetchPropostas();
    } catch (err) {
      console.error('Erro ao salvar resposta:', err);
      alert('Erro ao salvar resposta.');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) return null;

  return (
    <div class="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main class="flex-1 p-6 md:p-10">
        <div class="mb-8">
          <h1 class="text-2xl font-extrabold text-slate-900">
            Controle de Propostas
          </h1>
          <p class="text-xs text-gray-500 mt-1">
            Responda e gerencie as propostas enviadas pelos clientes
          </p>
        </div>

        {/* Tabela de Controle de Propostas (Estilo UniSenac Page 7) */}
        {loading ? (
          <div class="text-center py-16 text-gray-400">Carregando propostas...</div>
        ) : propostas.length === 0 ? (
          <div class="bg-white p-8 rounded-2xl text-center text-gray-500 border border-slate-200">
            Nenhuma proposta registrada no momento.
          </div>
        ) : (
          <div class="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                    <th class="py-3.5 px-4 font-bold">Foto do Imóvel</th>
                    <th class="py-3.5 px-4 font-bold">Modelo / Título</th>
                    <th class="py-3.5 px-4 font-bold">Preço R$</th>
                    <th class="py-3.5 px-4 font-bold">Cliente</th>
                    <th class="py-3.5 px-6 font-bold">Proposta do Cliente</th>
                    <th class="py-3.5 px-6 font-bold">Resposta da Imobiliária</th>
                    <th class="py-3.5 px-4 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {propostas.map((item) => (
                    <tr key={item.id} class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 px-4">
                        <img
                          src={item.imovel?.fotoUrl}
                          alt="Imóvel"
                          class="w-20 h-14 object-cover rounded-lg border border-slate-200 shadow-xs"
                        />
                      </td>
                      <td class="py-3 px-4 font-bold text-slate-900">
                        {item.imovel?.titulo || 'Imóvel indisponível'}
                      </td>
                      <td class="py-3 px-4 font-semibold text-blue-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.imovel?.preco || 0)}
                      </td>
                      <td class="py-3 px-4 text-xs font-semibold text-slate-700">
                        <div>{item.cliente?.nome}</div>
                        <div class="text-[11px] text-gray-400 font-normal">{item.cliente?.email}</div>
                      </td>
                      <td class="py-3 px-6 text-xs text-gray-800">
                        <div class="font-bold text-blue-900">
                          Oferta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorProposta)}
                        </div>
                        <p class="italic text-gray-600 mt-0.5">"{item.mensagem}"</p>
                      </td>
                      <td class="py-3 px-6 text-xs">
                        {item.respostaAdmin ? (
                          <div class="bg-blue-50 border border-blue-100 p-2 rounded text-slate-800">
                            <span class="font-bold text-blue-900 block mb-0.5">[{item.status}]</span>
                            {item.respostaAdmin}
                          </div>
                        ) : (
                          <span class="text-gray-400 italic">Aguardando resposta...</span>
                        )}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          {/* Botão Check Verde para Aprovação Rápida (Estilo UniSenac Page 7) */}
                          <button
                            onClick={() => handleQuickAccept(item.id)}
                            title="Aprovar Proposta Rapidamente"
                            class="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                          >
                            <Check class="w-5 h-5 stroke-[3]" />
                          </button>

                          {/* Botão Lápis/Mensagem para Editar Resposta */}
                          <button
                            onClick={() => handleOpenRespondModal(item)}
                            title="Responder ou Alterar Status"
                            class="text-amber-600 hover:text-amber-800 p-1.5 rounded-full hover:bg-amber-50 transition-colors"
                          >
                            <Edit3 class="w-5 h-5" />
                          </button>

                          {/* Botão Excluir */}
                          <button
                            onClick={() => handleDeleteProposta(item.id)}
                            title="Excluir Proposta"
                            class="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <XCircle class="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Resposta da Imobiliária */}
        {selectedProposta && (
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <h3 class="font-bold text-base flex items-center gap-2">
                  <MessageSquare class="w-5 h-5 text-amber-500" /> Responder Proposta do Cliente
                </h3>
                <button onClick={() => setSelectedProposta(null)} class="text-slate-400 hover:text-white">
                  <X class="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveResponse} class="p-6 space-y-4">
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span class="font-bold block text-slate-800">{selectedProposta.imovel?.titulo}</span>
                  <span class="text-gray-600">Cliente: {selectedProposta.cliente?.nome} ({selectedProposta.cliente?.email})</span>
                  <div class="font-bold text-blue-700 mt-1">
                    Proposta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProposta.valorProposta)}
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Status da Proposta</label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value)}
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Aceita">Aceita</option>
                    <option value="Em Analise">Em Análise</option>
                    <option value="Recusada">Recusada</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Resposta / Orientação da Imobiliária</label>
                  <textarea
                    rows="4"
                    value={respostaText}
                    onChange={(e) => setRespostaText(e.target.value)}
                    placeholder="Digite a resposta formal que o cliente visualizará..."
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div class="pt-4 flex justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedProposta(null)}
                    class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm shadow flex items-center gap-1.5"
                  >
                    <CheckCircle class="w-4 h-4" />
                    {saving ? 'Enviando...' : 'Salvar Resposta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
