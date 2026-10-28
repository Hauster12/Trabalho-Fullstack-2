const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Gera uma análise detalhada sobre o imóvel usando Gemini AI.
 * Se nenhuma chave GEMINI_API_KEY for fornecida, gera uma resposta analítica rica via fallback inteligente.
 */
async function generateImovelAiAnalysis(imovel) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Você é um analista imobiliário especialista da região sul do Brasil.
Analise o seguinte imóvel:
- Título: ${imovel.titulo}
- Tipo: ${imovel.tipo}
- Preço: R$ ${imovel.preco}
- Cidade/Bairro: ${imovel.cidade} - ${imovel.bairro}
- Área: ${imovel.areaM2} m²
- Quartos: ${imovel.quartos}, Banheiros: ${imovel.banheiros}, Vagas: ${imovel.vagas}
- Descrição: ${imovel.descricao}

Por favor, responda estritamente em formato JSON válido com estas chaves exatas:
{
  "pontosFortes": ["ponto 1", "ponto 2", "ponto 3"],
  "pontosFracos": ["ponto 1", "ponto 2"],
  "consumoEstimado": "Estimativa de condomínio/IPTU",
  "perfilIdeal": "Descrição do comprador ideal",
  "potencialValorizacao": "Alta / Média / Estável"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('⚡ Fallback para gerador de IA local devido a:', err.message);
    }
  }

  // Fallback Inteligente baseado em regras de mercado imobiliário
  const precoM2 = Math.round(imovel.preco / (imovel.areaM2 || 1));
  const pontosFortes = [
    `Excelente relação custo/benefício estimado em R$ ${precoM2.toLocaleString('pt-BR')}/m²`,
    `Localização valorizada no bairro ${imovel.bairro} em ${imovel.cidade}`,
    `Infraestrutura com ${imovel.quartos} dormitórios e ${imovel.vagas} vaga(s) de garagem`
  ];
  if (imovel.destaque) {
    pontosFortes.push('Imóvel selecionado na curadoria de destaques ImobiSelect');
  }

  const pontosFracos = [
    imovel.preco > 800000 
      ? 'Valor de investimento inicial elevado, requer aprovação de crédito diferenciada'
      : 'Poderá necessitar de pequenas atualizações de decoração a médio prazo',
    'Alta demanda no bairro podendo acelerar o tempo de decisão de compra'
  ];

  const iptuEstimado = Math.round(imovel.preco * 0.005 / 12);
  const condoEstimado = imovel.tipo === 'Apartamento' || imovel.tipo === 'Cobertura' ? Math.round(imovel.areaM2 * 6.5) : 0;

  return {
    pontosFortes,
    pontosFracos,
    consumoEstimado: condoEstimado > 0 
      ? `Condomínio estimado: R$ ${condoEstimado}/mês | IPTU aproximado: R$ ${iptuEstimado}/mês`
      : `IPTU estimado: R$ ${iptuEstimado}/mês (Sem taxa de condomínio)`,
    perfilIdeal: imovel.quartos >= 3 
      ? 'Famílias que buscam espaço, conforto e localização privilegiada.' 
      : 'Jovens casais, profissionais ou investidores focados em rentabilidade de aluguel.',
    potencialValorizacao: imovel.bairro === 'Laranjal' || imovel.bairro === 'Centro' ? 'Alta (Região em expansão constante)' : 'Média/Estável'
  };
}

module.exports = {
  generateImovelAiAnalysis
};
