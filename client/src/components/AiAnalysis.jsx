import React from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, TrendingUp, UserCheck } from 'lucide-react';

export default function AiAnalysis({ aiAnalysis }) {
  if (!aiAnalysis) return null;

  return (
    <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-lg my-8 border border-slate-800">
      <div class="flex items-center gap-3 font-extrabold text-base md:text-lg mb-6 border-b border-slate-800 pb-4">
        <div class="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-2 rounded-xl shadow-inner">
          <Sparkles class="w-5 h-5" />
        </div>
        <span>Análise Inteligente por Inteligência Artificial (IA)</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pontos Fortes */}
        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <h4 class="font-bold text-sm text-emerald-400 flex items-center gap-2 mb-3">
            <ThumbsUp class="w-4 h-4 text-emerald-400" /> Pontos Fortes: *
          </h4>
          <ul class="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-1">
            {aiAnalysis.pontosFortes && aiAnalysis.pontosFortes.map((p, idx) => (
              <li key={idx} class="leading-relaxed">{p}</li>
            ))}
          </ul>
        </div>

        {/* Pontos Fracos */}
        <div class="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <h4 class="font-bold text-sm text-amber-400 flex items-center gap-2 mb-3">
            <ThumbsDown class="w-4 h-4 text-amber-400" /> Pontos de Atenção: *
          </h4>
          <ul class="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-1">
            {aiAnalysis.pontosFracos && aiAnalysis.pontosFracos.map((p, idx) => (
              <li key={idx} class="leading-relaxed">{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200">
        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
          <span class="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
            <TrendingUp class="w-4 h-4 text-emerald-400" /> Potencial de Valorização: *
          </span>
          <p class="text-slate-300 font-medium">{aiAnalysis.potencialValorizacao || 'Média / Alta'}</p>
        </div>

        <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
          <span class="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
            <UserCheck class="w-4 h-4 text-indigo-400" /> Perfil de Comprador Ideal: *
          </span>
          <p class="text-slate-300">{aiAnalysis.perfilIdeal || 'Famílias e investidores'}</p>
        </div>
      </div>

      {aiAnalysis.consumoEstimado && (
        <div class="mt-4 text-xs text-slate-300 font-medium bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
          💡 <strong>Encargos Estimados:</strong> {aiAnalysis.consumoEstimado}
        </div>
      )}

      {/* Nota de aviso exigida pelo trabalho */}
      <p class="text-[11px] text-slate-400 italic mt-5 border-t border-slate-800 pt-3 flex items-center gap-1">
        * Informações geradas por IA. Sujeito a erros.
      </p>
    </div>
  );
}
