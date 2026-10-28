import React from 'react';
import { Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer class="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-12">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-white font-bold text-base">
          <Building2 class="w-5 h-5 text-amber-500" />
          <span>ImobiSelect</span>
        </div>
        <p class="text-center md:text-left">
          Trabalho #1 – Linguagens de Programação Emergentes | Prof. Edécio Fernando Iepsen | Centro Universitário UniSenac Pelotas
        </p>
        <p class="text-slate-500">
          © 2026 ImobiSelect. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
