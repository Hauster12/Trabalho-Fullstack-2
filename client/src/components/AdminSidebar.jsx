import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Building2, FileText, Calendar, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminSidebar() {
  const { admin, logoutAdminSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdminSession();
    navigate('/admin/login');
  };

  return (
    <aside class="w-64 bg-slate-900 min-h-screen p-5 flex flex-col border-r border-slate-800 text-slate-300">
      <div class="mb-8 px-2">
        <div class="flex items-center gap-3 font-extrabold text-lg text-white">
          <div class="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
            <Building2 class="w-5 h-5 text-emerald-400" />
          </div>
          <span>ImobiSelect: Admin</span>
        </div>
        {admin && (
          <p class="text-xs text-slate-400 font-semibold mt-2.5 flex items-center gap-1.5 bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
            {admin.nome}
          </p>
        )}
      </div>

      <nav class="flex-1 space-y-2 text-sm font-bold">
        <NavLink
          to="/admin/dashboard"
          class={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`
          }
        >
          <LayoutDashboard class="w-4 h-4" />
          Visão Geral
        </NavLink>

        <NavLink
          to="/admin/imoveis"
          class={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`
          }
        >
          <Building2 class="w-4 h-4" />
          Cadastro de Imóveis
        </NavLink>

        <NavLink
          to="/admin/propostas"
          class={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`
          }
        >
          <FileText class="w-4 h-4" />
          Controle de Propostas
        </NavLink>

        <NavLink
          to="/admin/agenda"
          class={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`
          }
        >
          <Calendar class="w-4 h-4" />
          Agenda de Visitas
        </NavLink>
      </nav>

      <div class="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
