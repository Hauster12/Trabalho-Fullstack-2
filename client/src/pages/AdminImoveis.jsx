import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Star, Trash2, Edit3, X, Building2, CheckCircle2 } from 'lucide-react';

export default function AdminImoveis() {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Apartamento',
    preco: '',
    cidade: 'Pelotas',
    bairro: '',
    endereco: '',
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    areaM2: 80,
    fotoUrl: '',
    destaque: false,
    descricao: ''
  });

  const [saving, setSaving] = useState(false);
  const [erroMsg, setErroMsg] = useState(null);

  const fetchImoveis = async () => {
    try {
      const response = await api.get('/imoveis');
      setImoveis(response.data);
    } catch (err) {
      console.error('Erro ao listar imóveis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchImoveis();
  }, [admin, navigate]);

  const handleOpenNewModal = () => {
    setEditingId(null);
    setFormData({
      titulo: '',
      tipo: 'Apartamento',
      preco: '',
      cidade: 'Pelotas',
      bairro: '',
      endereco: '',
      quartos: 2,
      banheiros: 2,
      vagas: 1,
      areaM2: 80,
      fotoUrl: '',
      destaque: false,
      descricao: ''
    });
    setErroMsg(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      titulo: item.titulo || '',
      tipo: item.tipo || 'Apartamento',
      preco: item.preco || '',
      cidade: item.cidade || 'Pelotas',
      bairro: item.bairro || '',
      endereco: item.endereco || '',
      quartos: item.quartos || 1,
      banheiros: item.banheiros || 1,
      vagas: item.vagas || 0,
      areaM2: item.areaM2 || 50,
      fotoUrl: item.fotoUrl || '',
      destaque: item.destaque || false,
      descricao: item.descricao || ''
    });
    setErroMsg(null);
    setShowModal(true);
  };

  const handleToggleDestaque = async (id) => {
    try {
      await api.patch(`/imoveis/${id}/destaque`);
      fetchImoveis();
    } catch (err) {
      alert('Erro ao alternar destaque do imóvel.');
    }
  };

  const handleDeleteImovel = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) return;
    try {
      await api.delete(`/imoveis/${id}`);
      fetchImoveis();
    } catch (err) {
      alert('Erro ao excluir imóvel.');
    }
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErroMsg(null);

    try {
      if (editingId) {
        // Edição de imóvel existente (PUT)
        await api.put(`/imoveis/${editingId}`, formData);
      } else {
        // Cadastro de novo imóvel (POST)
        await api.post('/imoveis', formData);
      }

      setShowModal(false);
      setEditingId(null);
      fetchImoveis();
    } catch (err) {
      console.error('Erro ao salvar imóvel:', err);
      setErroMsg(err.response?.data?.error || 'Erro ao salvar alterações no imóvel.');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) return null;

  return (
    <div class="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main class="flex-1 p-6 md:p-10">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">
              Cadastro de Imóveis
            </h1>
            <p class="text-xs text-gray-500 mt-1">Gerencie e edite os imóveis disponíveis na plataforma</p>
          </div>

          <button
            onClick={handleOpenNewModal}
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Novo Imóvel
          </button>
        </div>

        {/* Tabela de Listagem de Imóveis com Botão de Editar */}
        {loading ? (
          <div class="text-center py-16 text-gray-400">Carregando imóveis...</div>
        ) : (
          <div class="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                    <th class="py-3.5 px-6 font-bold">Foto</th>
                    <th class="py-3.5 px-6 font-bold">Título / Tipo</th>
                    <th class="py-3.5 px-6 font-bold">Localização</th>
                    <th class="py-3.5 px-6 font-bold">Preço R$</th>
                    <th class="py-3.5 px-6 font-bold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {imoveis.map((item) => (
                    <tr key={item.id} class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 px-6">
                        <img
                          src={item.fotoUrl}
                          alt={item.titulo}
                          class="w-20 h-14 object-cover rounded-lg shadow-xs border border-slate-200"
                        />
                      </td>
                      <td class="py-3 px-6">
                        <span class="font-bold text-slate-900 block">{item.titulo}</span>
                        <span class="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">
                          {item.tipo}
                        </span>
                      </td>
                      <td class="py-3 px-6 text-xs text-gray-600 font-medium">
                        {item.bairro}, {item.cidade}
                      </td>
                      <td class="py-3 px-6 font-extrabold text-blue-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                      </td>
                      <td class="py-3 px-6 text-center">
                        <div class="flex items-center justify-center gap-2.5">
                          {/* Alternar Destaque (Estrela) */}
                          <button
                            onClick={() => handleToggleDestaque(item.id)}
                            title={item.destaque ? 'Remover dos Destaques' : 'Marcar como Destaque'}
                            class="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                          >
                            <Star
                              class={`w-5 h-5 ${
                                item.destaque
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300 hover:text-amber-400'
                              }`}
                            />
                          </button>

                          {/* Editar Imóvel (Lápis Azul) */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="Editar Dados do Imóvel"
                            class="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                          >
                            <Edit3 class="w-5 h-5" />
                          </button>

                          {/* Excluir Imóvel (Lixeira Vermelha) */}
                          <button
                            onClick={() => handleDeleteImovel(item.id)}
                            title="Excluir Imóvel"
                            class="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 class="w-5 h-5" />
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

        {/* Modal de Cadastro / Edição de Imóvel */}
        {showModal && (
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <h3 class="font-bold text-lg flex items-center gap-2">
                  <Building2 class="w-5 h-5 text-amber-500" />
                  {editingId ? 'Editar Dados do Imóvel' : 'Cadastrar Novo Imóvel'}
                </h3>
                <button onClick={() => setShowModal(false)} class="text-slate-400 hover:text-white">
                  <X class="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} class="p-6 space-y-4 overflow-y-auto flex-1">
                {erroMsg && (
                  <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium">
                    {erroMsg}
                  </div>
                )}

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título do Anúncio</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Residencial Laranjal Premium"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Imóvel</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Apartamento">Apartamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Cobertura">Cobertura</option>
                      <option value="Terreno">Terreno</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      placeholder="Ex: 890000"
                      required
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      required
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      placeholder="Ex: Laranjal"
                      required
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Av. Doutor Antônio Augusto Assumpção, 450"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div class="grid grid-cols-4 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Quartos</label>
                    <input
                      type="number"
                      value={formData.quartos}
                      onChange={(e) => setFormData({ ...formData, quartos: e.target.value })}
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Banheiros</label>
                    <input
                      type="number"
                      value={formData.banheiros}
                      onChange={(e) => setFormData({ ...formData, banheiros: e.target.value })}
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Vagas</label>
                    <input
                      type="number"
                      value={formData.vagas}
                      onChange={(e) => setFormData({ ...formData, vagas: e.target.value })}
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Área m²</label>
                    <input
                      type="number"
                      value={formData.areaM2}
                      onChange={(e) => setFormData({ ...formData, areaM2: e.target.value })}
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">URL da Foto do Imóvel</label>
                  <input
                    type="url"
                    value={formData.fotoUrl}
                    onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Descrição</label>
                  <textarea
                    rows="3"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Detalhes sobre infraestrutura e acabamento..."
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="destaque"
                    checked={formData.destaque}
                    onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                    class="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="destaque" class="text-xs font-bold text-gray-700">
                    Marcar este imóvel como Destaque na Página Inicial
                  </label>
                </div>

                <div class="pt-4 flex justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors shadow flex items-center gap-2"
                  >
                    <CheckCircle2 class="w-4 h-4" />
                    {saving ? 'Salvando...' : editingId ? 'Atualizar Imóvel' : 'Salvar Imóvel'}
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
