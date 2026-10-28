import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  MapPin,
  RefreshCw,
  Filter
} from 'lucide-react';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const calendarMessages = {
  allDay: 'Dia todo',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Lista / Agenda',
  date: 'Data',
  time: 'Horário',
  event: 'Visita / Compromisso',
  noEventsInRange: 'Nenhuma visita agendada neste intervalo.',
  showMore: (total) => `+ ver mais ${total}`,
};

export default function AdminAgenda() {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [visitas, setVisitas] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODAS');

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState(null);

  const [formVisita, setFormVisita] = useState({
    titulo: '',
    clienteNome: '',
    clienteTelefone: '',
    corretor: admin?.nome || 'André Santos',
    imovelId: '',
    inicio: '',
    fim: '',
    status: 'Confirmada',
    observacoes: '',
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resVisitas, resImoveis] = await Promise.all([
        api.get('/visitas'),
        api.get('/imoveis'),
      ]);

      const visitasMapeadas = resVisitas.data.map((v) => ({
        id: v.id,
        title: v.titulo,
        start: new Date(v.inicio),
        end: new Date(v.fim),
        clienteNome: v.clienteNome,
        clienteTelefone: v.clienteTelefone,
        corretor: v.corretor,
        status: v.status,
        imovel: v.imovel,
        imovelId: v.imovelId,
        observacoes: v.observacoes,
      }));

      setVisitas(visitasMapeadas);
      setImoveis(resImoveis.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados da agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    carregarDados();
  }, [admin, navigate]);

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleSelectSlot = ({ start, end }) => {
    const finalEnd = start.getTime() === end.getTime()
      ? new Date(start.getTime() + 60 * 60 * 1000)
      : end;

    setFormVisita({
      titulo: '',
      clienteNome: '',
      clienteTelefone: '',
      corretor: admin?.nome || 'André Santos',
      imovelId: imoveis[0]?.id || '',
      inicio: formatDateTimeLocal(start),
      fim: formatDateTimeLocal(finalEnd),
      status: 'Confirmada',
      observacoes: '',
    });
    setModalNovoAberto(true);
  };

  const handleSelectEvent = (event) => {
    setVisitaSelecionada(event);
    setModalDetalhesAberto(true);
  };

  const handleSalvarVisita = async (e) => {
    e.preventDefault();
    if (!formVisita.titulo || !formVisita.clienteNome || !formVisita.inicio || !formVisita.fim) {
      alert('Por favor, preencha os campos obrigatórios (título, cliente, início e término).');
      return;
    }

    try {
      await api.post('/visitas', formVisita);
      setModalNovoAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao cadastrar visita:', err);
      alert('Não foi possível salvar a visita. Tente novamente.');
    }
  };

  const handleAtualizarStatus = async (novoStatus) => {
    if (!visitaSelecionada) return;
    try {
      await api.put(`/visitas/${visitaSelecionada.id}`, { status: novoStatus });
      setModalDetalhesAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar status da visita:', err);
      alert('Erro ao atualizar status.');
    }
  };

  const handleExcluirVisita = async () => {
    if (!visitaSelecionada) return;
    if (!window.confirm(`Deseja realmente cancelar e excluir a visita "${visitaSelecionada.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/visitas/${visitaSelecionada.id}`);
      setModalDetalhesAberto(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao excluir visita:', err);
      alert('Erro ao excluir visita.');
    }
  };

  const visitasFiltradas = useMemo(() => {
    if (filtroStatus === 'TODAS') return visitas;
    return visitas.filter((v) => v.status === filtroStatus);
  }, [visitas, filtroStatus]);

  const eventPropGetter = (event) => {
    let bg = '#059669';
    let border = '#047857';

    if (event.status === 'Pendente') {
      bg = '#d97706';
      border = '#b45309';
    } else if (event.status === 'Realizada') {
      bg = '#2563eb';
      border = '#1d4ed8';
    } else if (event.status === 'Cancelada') {
      bg = '#e11d48';
      border = '#be123c';
    }

    return {
      style: {
        backgroundColor: bg,
        borderColor: border,
        color: '#ffffff',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '0.82rem',
        padding: '2px 6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    };
  };

  const totalAgendadas = visitas.length;
  const hoje = new Date().toDateString();
  const visitasHoje = visitas.filter((v) => v.start.toDateString() === hoje).length;
  const pendentes = visitas.filter((v) => v.status === 'Pendente').length;
  const confirmadas = visitas.filter((v) => v.status === 'Confirmada').length;

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Agenda de Visitas aos Imóveis</h1>
              <p className="text-xs text-slate-500 font-medium">
                Gerenciamento de horários com clientes e corretores via <span className="font-semibold text-emerald-600">react-big-calendar</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const now = new Date();
                const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
                setFormVisita({
                  titulo: '',
                  clienteNome: '',
                  clienteTelefone: '',
                  corretor: admin?.nome || 'André Santos',
                  imovelId: imoveis[0]?.id || '',
                  inicio: formatDateTimeLocal(now),
                  fim: formatDateTimeLocal(inOneHour),
                  status: 'Confirmada',
                  observacoes: '',
                });
                setModalNovoAberto(true);
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nova Visita
            </button>
            <button
              onClick={carregarDados}
              title="Recarregar dados"
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total de Visitas</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{totalAgendadas}</h3>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Visitas Hoje</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{visitasHoje}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Confirmadas</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">{confirmadas}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Pendentes</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">{pendentes}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-600">Filtrar por Status:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['TODAS', 'Confirmada', 'Pendente', 'Realizada', 'Cancelada'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filtroStatus === status
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Confirmada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pendente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Realizada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Cancelada
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ minHeight: '680px' }}>
          <Calendar
            localizer={localizer}
            events={visitasFiltradas}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            step={30}
            timeslots={2}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            messages={calendarMessages}
            culture="pt-BR"
            className="rounded-xl font-sans"
            style={{ height: 650 }}
          />
        </div>
      </main>

      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-bold">
                <CalendarIcon className="w-5 h-5 text-emerald-400" />
                <span>Agendar Nova Visita</span>
              </div>
              <button
                onClick={() => setModalNovoAberto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarVisita} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Agendamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Visita Casa Laranjal (Mariana)"
                  value={formVisita.titulo}
                  onChange={(e) => setFormVisita({ ...formVisita, titulo: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={formVisita.clienteNome}
                    onChange={(e) => setFormVisita({ ...formVisita, clienteNome: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(53) 99999-9999"
                    value={formVisita.clienteTelefone}
                    onChange={(e) => setFormVisita({ ...formVisita, clienteTelefone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Imóvel para Visitação</label>
                <select
                  value={formVisita.imovelId}
                  onChange={(e) => setFormVisita({ ...formVisita, imovelId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="">Nenhum imóvel específico</option>
                  {imoveis.map((imv) => (
                    <option key={imv.id} value={imv.id}>
                      {imv.titulo} - {imv.bairro}, {imv.cidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Início da Visita *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formVisita.inicio}
                    onChange={(e) => setFormVisita({ ...formVisita, inicio: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Previsão de Término *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formVisita.fim}
                    onChange={(e) => setFormVisita({ ...formVisita, fim: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corretor Responsável</label>
                  <input
                    type="text"
                    value={formVisita.corretor}
                    onChange={(e) => setFormVisita({ ...formVisita, corretor: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Inicial</label>
                  <select
                    value={formVisita.status}
                    onChange={(e) => setFormVisita({ ...formVisita, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observações Internas</label>
                <textarea
                  rows="2"
                  placeholder="Informações adicionais, preferências do cliente ou detalhes de chaves..."
                  value={formVisita.observacoes}
                  onChange={(e) => setFormVisita({ ...formVisita, observacoes: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all"
                >
                  Agendar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalDetalhesAberto && visitaSelecionada && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Detalhes do Agendamento
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{visitaSelecionada.title}</h3>
              </div>
              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500">Status da Visita:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    visitaSelecionada.status === 'Confirmada'
                      ? 'bg-emerald-100 text-emerald-700'
                      : visitaSelecionada.status === 'Pendente'
                      ? 'bg-amber-100 text-amber-700'
                      : visitaSelecionada.status === 'Realizada'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {visitaSelecionada.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                  <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  <span>
                    {format(visitaSelecionada.start, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>
                    Das {format(visitaSelecionada.start, 'HH:mm')} até {format(visitaSelecionada.end, 'HH:mm')}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-900">{visitaSelecionada.clienteNome}</span>
                </div>
                {visitaSelecionada.clienteTelefone && (
                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{visitaSelecionada.clienteTelefone}</span>
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  Corretor: <strong className="text-slate-700">{visitaSelecionada.corretor}</strong>
                </div>
              </div>

              {visitaSelecionada.imovel && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>{visitaSelecionada.imovel.titulo}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {visitaSelecionada.imovel.endereco} - {visitaSelecionada.imovel.bairro},{' '}
                      {visitaSelecionada.imovel.cidade}
                    </span>
                  </div>
                </div>
              )}

              {visitaSelecionada.observacoes && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1 font-bold text-slate-700 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Observações:</span>
                  </div>
                  <p>{visitaSelecionada.observacoes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-500 mb-2">Atualizar Status:</span>
                <div className="flex gap-2 flex-wrap">
                  {visitaSelecionada.status !== 'Confirmada' && (
                    <button
                      onClick={() => handleAtualizarStatus('Confirmada')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Confirmar Visita
                    </button>
                  )}
                  {visitaSelecionada.status !== 'Realizada' && (
                    <button
                      onClick={() => handleAtualizarStatus('Realizada')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Marcar como Realizada
                    </button>
                  )}
                  {visitaSelecionada.status !== 'Cancelada' && (
                    <button
                      onClick={() => handleAtualizarStatus('Cancelada')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Cancelar Visita
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExcluirVisita}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir da Agenda
                </button>

                <button
                  type="button"
                  onClick={() => setModalDetalhesAberto(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
