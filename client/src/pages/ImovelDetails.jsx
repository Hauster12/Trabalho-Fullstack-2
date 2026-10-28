import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AiAnalysis from '../components/AiAnalysis';
import {
  BedDouble, Bath, Car, Maximize, MapPin, Send, CheckCircle2, Lock, ArrowLeft
} from 'lucide-react';

export default function ImovelDetails() {
  const { id } = useParams();
  const { cliente, clienteKey } = useContext(AuthContext);

  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valorProposta, setValorProposta] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState(null);
  const [erroMsg, setErroMsg] = useState(null);

  useEffect(() => {
    async function loadImovel() {
      try {
        const response = await api.get(`/imoveis/${id}`);
        setImovel(response.data);
        if (response.data.preco) {
          setValorProposta(response.data.preco.toString());
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do imóvel:', err);
      } finally {
        setLoading(false);
      }
    }
    loadImovel();
  }, [id]);

  const handleSubmitProposta = async (e) => {
    e.preventDefault();
    if (!cliente || !clienteKey) {
      setErroMsg('Você precisa estar logado para enviar uma proposta.');
      return;
    }

    if (!valorProposta || !mensagem) {
      setErroMsg('Por favor, informe o valor e o texto da sua proposta.');
      return;
    }

    setEnviando(true);
    setErroMsg(null);
    setSucessoMsg(null);

    try {
      await api.post('/propostas', {
        imovelId: imovel.id,
        clienteId: clienteKey,
        valorProposta: parseFloat(valorProposta),
        mensagem
      });

      setSucessoMsg('Proposta enviada com sucesso! Você pode acompanhá-la em "Minhas Propostas".');
      setMensagem('');
    } catch (err) {
      console.error('Erro ao enviar proposta:', err);
      setErroMsg(err.response?.data?.error || 'Falha ao enviar proposta.');
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div class="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div class="flex-1 flex items-center justify-center py-20 text-gray-500 font-medium">
          Carregando informações do imóvel...
        </div>
        <Footer />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div class="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div class="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 class="text-2xl font-bold text-slate-800">Imóvel não encontrado</h2>
          <Link to="/" class="mt-4 inline-block bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
            Voltar para os Imóveis
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(imovel.preco);

  return (
    <div class="min-h-screen flex flex-col bg-slate-100/70">
      <Header />

      <main class="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        <Link to="/" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 mb-6 transition-colors bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-200">
          <ArrowLeft class="w-4 h-4" /> Voltar para o catálogo
        </Link>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* Banner de Imagem com Gradient */}
          <div class="relative h-80 sm:h-[450px] w-full bg-slate-950">
            <img
              src={imovel.fotoUrl}
              alt={imovel.titulo}
              class="w-full h-full object-cover opacity-90"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8 text-white">
              <span class="bg-emerald-600 text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block shadow-md">
                {imovel.tipo}
              </span>
              <h1 class="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
                {imovel.titulo}
              </h1>
              <p class="text-sm text-slate-200 flex items-center gap-1.5 mt-2 font-medium">
                <MapPin class="w-4 h-4 text-emerald-400" />
                {imovel.endereco} - {imovel.bairro}, {imovel.cidade}
              </p>
            </div>
          </div>

          {/* Ficha de Atributos */}
          <div class="p-6 md:p-10">
            <div class="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase tracking-wider block">Valor de Venda</span>
                <span class="text-4xl font-black text-slate-900">{precoFormatado}</span>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-800">
                <div class="flex items-center gap-2 bg-slate-100/90 px-4 py-2.5 rounded-2xl border border-slate-200/60">
                  <BedDouble class="w-5 h-5 text-emerald-600" />
                  <span>{imovel.quartos} Quarto(s)</span>
                </div>
                <div class="flex items-center gap-2 bg-slate-100/90 px-4 py-2.5 rounded-2xl border border-slate-200/60">
                  <Bath class="w-5 h-5 text-emerald-600" />
                  <span>{imovel.banheiros} Banheiro(s)</span>
                </div>
                <div class="flex items-center gap-2 bg-slate-100/90 px-4 py-2.5 rounded-2xl border border-slate-200/60">
                  <Car class="w-5 h-5 text-emerald-600" />
                  <span>{imovel.vagas} Vaga(s)</span>
                </div>
                <div class="flex items-center gap-2 bg-slate-100/90 px-4 py-2.5 rounded-2xl border border-slate-200/60">
                  <Maximize class="w-5 h-5 text-emerald-600" />
                  <span>{imovel.areaM2} m²</span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div class="mt-8">
              <h3 class="text-lg font-extrabold text-slate-900 mb-3">Sobre este imóvel</h3>
              <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {imovel.descricao}
              </p>
            </div>

            {/* Análise de Inteligência Artificial */}
            <AiAnalysis aiAnalysis={imovel.aiAnalysis} />

            {/* Formulário / Bloqueio de Proposta */}
            <div class="mt-10 pt-8 border-t border-slate-200">
              {!cliente ? (
                <div class="bg-indigo-950 text-white rounded-2xl p-8 text-center border border-indigo-800/60 shadow-lg">
                  <div class="w-12 h-12 bg-indigo-900 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-700">
                    <Lock class="w-6 h-6" />
                  </div>
                  <h3 class="text-xl font-extrabold text-white mb-2">
                    😍 Gostou? Identifique-se e faça uma Proposta!
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Faça login para enviar ofertas diretamente ao proprietário/corretor e acompanhar as respostas.
                  </p>
                  <Link
                    to="/login"
                    class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-8 py-3 rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
                  >
                    Identificar-se Agora
                  </Link>
                </div>
              ) : (
                <div class="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-8 shadow-xs">
                  <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    😃 Você pode fazer uma Proposta para este imóvel!
                  </h3>

                  {sucessoMsg && (
                    <div class="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-bold mb-5 flex items-center gap-2">
                      <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
                      {sucessoMsg}
                    </div>
                  )}

                  {erroMsg && (
                    <div class="bg-rose-100 border border-rose-300 text-rose-900 p-4 rounded-xl text-xs font-bold mb-5">
                      {erroMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmitProposta} class="space-y-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Cliente Logado</label>
                      <input
                        type="text"
                        disabled
                        value={`${cliente.nome} (${cliente.email})`}
                        class="w-full bg-slate-200/80 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 cursor-not-allowed"
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Valor da Proposta (R$)</label>
                        <input
                          type="number"
                          value={valorProposta}
                          onChange={(e) => setValorProposta(e.target.value)}
                          placeholder="Ex: 850000"
                          required
                          class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Detalhes e Condições da Proposta</label>
                      <textarea
                        rows="3"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Ex: Oferta à vista R$ 800 mil com entrada imediata e saldo via financiamento bancário."
                        required
                        class="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={enviando}
                      class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send class="w-4 h-4" />
                      {enviando ? 'Enviando Proposta...' : 'Enviar Proposta'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
