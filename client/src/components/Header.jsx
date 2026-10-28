import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Search, Star, UserCheck, LogOut, ShieldCheck, FileText, Layers } from 'lucide-react';

export default function Header({ onSearch, onShowDestaques }) {
  const { cliente, logoutClienteSession, admin } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleDestaquesClick = () => {
    setSearchTerm('');
    if (onShowDestaques) {
      onShowDestaques();
    }
  };

  return (
    <header class="w-full shadow-lg bg-slate-900 border-b border-slate-800">
      {/* Faixa Superior Escura Elegante (Navy/Emerald) */}
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" class="flex items-center gap-3 font-black text-2xl text-white tracking-tight hover:opacity-95 transition-opacity">
          <div class="bg-emerald-500/20 border border-emerald-500/30 p-2.5 rounded-2xl shadow-inner">
            <Building2 class="w-7 h-7 text-emerald-400" />
          </div>
          <div class="flex flex-col">
            <span class="leading-none text-white font-extrabold text-xl md:text-2xl">
              Imobi<span class="text-emerald-400">Select</span>
            </span>
            <span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Imóveis de Alto Padrão & Gestão
            </span>
          </div>
        </Link>

        {/* Status do Cliente e links de Acesso */}
        <div class="flex items-center gap-3 text-xs font-semibold">
          {cliente ? (
            <div class="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/70 shadow-sm">
              <span class="flex items-center gap-1.5 font-bold text-emerald-300">
                <UserCheck class="w-4 h-4 text-emerald-400" />
                {cliente.nome}
              </span>
              <span class="text-slate-600">|</span>
              <Link to="/minhas-propostas" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors">
                <FileText class="w-3.5 h-3.5" />
                Minhas Propostas
              </Link>
              <button
                onClick={logoutClienteSession}
                class="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1 border border-rose-500/30"
                title="Sair da conta"
              >
                <LogOut class="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-5 py-2 rounded-xl shadow transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <UserCheck class="w-4 h-4" />
              Identifique-se
            </Link>
          )}

          {admin ? (
            <Link
              to="/admin/dashboard"
              class="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck class="w-4 h-4 text-indigo-400" />
              Painel Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              class="text-xs text-slate-400 hover:text-white underline underline-offset-4 ml-1 opacity-80 hover:opacity-100 transition-opacity"
            >
              Área Restrita
            </Link>
          )}
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros (Layout Modernizado) */}
      <div class="bg-slate-950/60 border-t border-slate-800/80 py-4 px-4 md:px-8">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-4">
          <form onSubmit={handleSearchSubmit} class="flex-1 min-w-[280px] max-w-3xl flex items-center gap-2">
            <div class="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por tipo, cidade, bairro, preço ou caracteristicas..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-inner"
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <Search class="w-4 h-4" />
              Pesquisar
            </button>
          </form>

          <button
            type="button"
            onClick={handleDestaquesClick}
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <Star class="w-4 h-4 text-amber-300 fill-amber-300" />
            Exibir Destaques
          </button>
        </div>
      </div>
    </header>
  );
}
