import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Car, Maximize, MapPin, Star, ArrowRight } from 'lucide-react';

export default function ImovelCard({ imovel }) {
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(imovel.preco);

  return (
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col group">
      {/* Container de Imagem com Zoom sutil e Badge Emerald */}
      <div class="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={imovel.fotoUrl}
          alt={imovel.titulo}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

        {imovel.destaque && (
          <span class="absolute top-3.5 left-3.5 bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-emerald-400/40">
            <Star class="w-3.5 h-3.5 fill-white" />
            Destaque
          </span>
        )}

        <span class="absolute top-3.5 right-3.5 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700/60">
          {imovel.tipo}
        </span>

        <div class="absolute bottom-3 left-3.5 flex items-center gap-1 text-xs font-semibold text-slate-200 drop-shadow">
          <MapPin class="w-3.5 h-3.5 text-emerald-400" />
          {imovel.bairro} - {imovel.cidade}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="font-extrabold text-lg text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {imovel.titulo}
          </h3>

          {/* Atributos em Chips Elegantes */}
          <div class="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-semibold text-slate-700">
            <div class="bg-slate-100/80 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-200/60" title="Quartos">
              <BedDouble class="w-4 h-4 text-emerald-600" />
              <span>{imovel.quartos} qto</span>
            </div>

            <div class="bg-slate-100/80 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-200/60" title="Banheiros">
              <Bath class="w-4 h-4 text-emerald-600" />
              <span>{imovel.banheiros} ban</span>
            </div>

            <div class="bg-slate-100/80 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-200/60" title="Vagas">
              <Car class="w-4 h-4 text-emerald-600" />
              <span>{imovel.vagas} vaga</span>
            </div>

            <div class="bg-slate-100/80 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-200/60" title="Área m²">
              <Maximize class="w-4 h-4 text-emerald-600" />
              <span>{imovel.areaM2}m²</span>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor de Venda</span>
            <span class="text-2xl font-black text-slate-900 tracking-tight">{precoFormatado}</span>
          </div>
        </div>

        <Link
          to={`/imovel/${imovel.id}`}
          class="mt-6 w-full bg-slate-900 group-hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
        >
          Ver Detalhes do Imóvel
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
