import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImovelCard from '../components/ImovelCard';
import { Building, RefreshCw, Star, Layers, Search } from 'lucide-react';

export default function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Título Dinâmico (Requisito do Usuário)
  const [titlePrefix, setTitlePrefix] = useState('Imóveis em ');
  const [titleHighlight, setTitleHighlight] = useState('destaque');
  const [activeFilterSubtitle, setActiveFilterSubtitle] = useState('Imóveis selecionados na nossa curadoria especial');
  const [currentFilterMode, setCurrentFilterMode] = useState('destaques'); // 'destaques' | 'todos' | 'busca'

  const fetchImoveis = async (busca = '', apenasDestaques = false) => {
    setLoading(true);
    try {
      let params = {};
      if (apenasDestaques) {
        params.apenasDestaques = 'true';
        setTitlePrefix('Imóveis em ');
        setTitleHighlight('destaque');
        setActiveFilterSubtitle('Imóveis selecionados na nossa curadoria de destaque');
        setCurrentFilterMode('destaques');
      } else if (busca) {
        params.busca = busca;
        setTitlePrefix('Resultados da ');
        setTitleHighlight('pesquisa');
        setActiveFilterSubtitle(`Exibindo busca para: "${busca}"`);
        setCurrentFilterMode('busca');
      } else {
        // Exibir Todos
        setTitlePrefix('Todos os ');
        setTitleHighlight('imóveis');
        setActiveFilterSubtitle('Catálogo completo de propriedades e lançamentos disponíveis');
        setCurrentFilterMode('todos');
      }

      const response = await api.get('/imoveis', { params });
      setImoveis(response.data);
    } catch (err) {
      console.error('Erro ao buscar imóveis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar destaques inicialmente
    fetchImoveis('', true);
  }, []);

  const handleSearch = (term) => {
    fetchImoveis(term, false);
  };

  const handleShowDestaques = () => {
    fetchImoveis('', true);
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-100/70">
      <Header onSearch={handleSearch} onShowDestaques={handleShowDestaques} />

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10">
        {/* Título Dinâmico + Novo Estilo Visual Exclusivo */}
        <div class="mb-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
              {currentFilterMode === 'destaques' && <Star class="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />}
              {currentFilterMode === 'todos' && <Layers class="w-3.5 h-3.5 text-emerald-600" />}
              {currentFilterMode === 'busca' && <Search class="w-3.5 h-3.5 text-emerald-600" />}
              {currentFilterMode === 'destaques' ? 'Curadoria Exclusiva' : currentFilterMode === 'todos' ? 'Catálogo Completo' : 'Busca Personalizada'}
            </div>

            <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {titlePrefix}
              <span class="relative inline-block text-emerald-600 underline decoration-emerald-500 decoration-4 underline-offset-8">
                {titleHighlight}
              </span>
            </h1>

            <p class="text-xs md:text-sm text-slate-500 mt-3 font-medium">
              {activeFilterSubtitle} — <strong class="text-slate-800">{imoveis.length} {imoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}</strong>
            </p>
          </div>

          <div class="flex items-center gap-3">
            {currentFilterMode !== 'todos' && (
              <button
                onClick={() => fetchImoveis('', false)}
                class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <Layers class="w-4 h-4 text-emerald-400" />
                Exibir Todos os Imóveis
              </button>
            )}

            {currentFilterMode !== 'destaques' && (
              <button
                onClick={handleShowDestaques}
                class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <Star class="w-4 h-4 fill-white" />
                Ver Destaques
              </button>
            )}
          </div>
        </div>

        {/* Loading ou Grid de Imóveis */}
        {loading ? (
          <div class="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw class="w-10 h-10 animate-spin text-emerald-600 mb-3" />
            <p class="text-sm font-semibold text-slate-600">Carregando oportunidades imobiliárias...</p>
          </div>
        ) : imoveis.length === 0 ? (
          <div class="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80 my-8">
            <Building class="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-slate-800">Nenhum imóvel encontrado</h3>
            <p class="text-sm text-slate-500 mt-2">
              Tente utilizar outros termos na pesquisa ou clique em "Exibir Todos os Imóveis".
            </p>
            <button
              onClick={() => fetchImoveis('', false)}
              class="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow"
            >
              Exibir Todos os Imóveis
            </button>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {imoveis.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
