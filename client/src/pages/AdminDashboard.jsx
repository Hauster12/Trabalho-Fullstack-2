import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Users, Building2, FileText, Calendar, RefreshCw, ShieldCheck } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }

    async function loadStats() {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (err) {
        console.error('Erro ao carregar estatísticas do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [admin, navigate]);

  if (!admin) return null;

  if (loading || !stats) {
    return (
      <div class="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div class="flex-1 flex items-center justify-center text-gray-500">
          <RefreshCw class="w-8 h-8 animate-spin text-blue-600 mb-2" />
        </div>
      </div>
    );
  }

  // Configuração dos gráficos idênticos aos do screenshot UniSenac (Page 6)
  const chartTipoData = {
    labels: stats.charts.imoveisPorTipo.map(item => item.tipo),
    datasets: [
      {
        label: 'Nº de Imóveis',
        data: stats.charts.imoveisPorTipo.map(item => item.quantidade),
        backgroundColor: [
          '#22c55e', // Verde (Renault/Casa)
          '#3b82f6', // Azul (Fiat/Apto)
          '#06b6d4', // Ciano (Hyundai/Cobertura)
          '#f59e0b'  // Amarelo
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartCidadeData = {
    labels: stats.charts.clientesPorCidade.map(item => item.cidade),
    datasets: [
      {
        label: 'Clientes por Cidade',
        data: stats.charts.clientesPorCidade.map(item => item.quantidade),
        backgroundColor: [
          '#16a34a', // Bagé
          '#0284c7', // Rio Grande
          '#0ea5e9', // Pelotas
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  return (
    <div class="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main class="flex-1 p-6 md:p-10">
        {/* Barra Topo do Admin */}
        <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 border border-slate-200">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck class="w-5 h-5 text-blue-600" />
            <span>ImobiSelect: Admin Dashboard</span>
          </div>
          <div class="text-xs text-gray-500 font-semibold">
            Logado como: <span class="text-blue-900 font-bold">{admin.nome}</span>
          </div>
        </div>

        <h1 class="text-2xl font-extrabold text-slate-900 mb-6">
          Visão Geral do Sistema
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm hover:shadow transition-shadow">
            <span class="text-4xl font-extrabold text-blue-600 block mb-2">
              {stats.totals.clientes}
            </span>
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nº Clientes
            </span>
          </div>

          <div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-6 text-center shadow-sm hover:shadow transition-shadow">
            <span class="text-4xl font-extrabold text-rose-600 block mb-2">
              {stats.totals.imoveis}
            </span>
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nº Imóveis
            </span>
          </div>

          <div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center shadow-sm hover:shadow transition-shadow">
            <span class="text-4xl font-extrabold text-emerald-600 block mb-2">
              {stats.totals.propostas}
            </span>
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nº Propostas
            </span>
          </div>

          <Link
            to="/admin/agenda"
            class="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center shadow-sm hover:shadow hover:border-amber-300 transition-all group block"
          >
            <span class="text-4xl font-extrabold text-amber-600 block mb-2 group-hover:scale-105 transition-transform">
              {stats.totals.visitas ?? 0}
            </span>
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-600" />
              Visitas na Agenda
            </span>
          </Link>
        </div>

        {/* 2 Gráficos de Rosca / Pizza (Estilo UniSenac Page 6) */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center">
            <h3 class="font-bold text-slate-800 text-sm mb-4 text-center">
              Imóveis por Tipo
            </h3>
            <div class="w-64 h-64 relative">
              <Doughnut
                data={chartTipoData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' }
                  },
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center">
            <h3 class="font-bold text-slate-800 text-sm mb-4 text-center">
              Clientes por Cidade
            </h3>
            <div class="w-64 h-64 relative">
              <Doughnut
                data={chartCidadeData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' }
                  },
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
