const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getDashboardStats(req, res) {
  try {
    const totalClientes = await prisma.cliente.count();
    const totalImoveis = await prisma.imovel.count();
    const totalPropostas = await prisma.proposta.count();
    const totalVisitas = await prisma.visita.count();

    // Contagem por Tipo de Imóvel (Apartamento, Casa, Cobertura, Terreno)
    const imoveisPorTipoGroup = await prisma.imovel.groupBy({
      by: ['tipo'],
      _count: { id: true }
    });

    const imoveisPorTipo = imoveisPorTipoGroup.map(g => ({
      tipo: g.tipo,
      quantidade: g._count.id
    }));

    // Contagem de Clientes por Cidade
    const clientesPorCidadeGroup = await prisma.cliente.groupBy({
      by: ['cidade'],
      _count: { id: true }
    });

    const clientesPorCidade = clientesPorCidadeGroup.map(g => ({
      cidade: g.cidade,
      quantidade: g._count.id
    }));

    // Contagem de Propostas por Status (Pendente, Aceita, Recusada, Em Analise)
    const propostasPorStatusGroup = await prisma.proposta.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const propostasPorStatus = propostasPorStatusGroup.map(g => ({
      status: g.status,
      quantidade: g._count.id
    }));

    return res.json({
      totals: {
        clientes: totalClientes,
        imoveis: totalImoveis,
        propostas: totalPropostas,
        visitas: totalVisitas
      },
      charts: {
        imoveisPorTipo,
        clientesPorCidade,
        propostasPorStatus
      }
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas do dashboard:', err);
    return res.status(500).json({ error: 'Erro ao gerar dados do dashboard.' });
  }
}

module.exports = {
  getDashboardStats
};
