const { PrismaClient } = require('@prisma/client');
const { generateImovelAiAnalysis } = require('../services/aiService');

const prisma = new PrismaClient();

// Listar Imóveis (com filtro de pesquisa e filtro de destaque)
async function getImoveis(req, res) {
  try {
    const { busca, apenasDestaques } = req.query;

    let whereClause = {};

    if (apenasDestaques === 'true') {
      whereClause.destaque = true;
    }

    if (busca && busca.trim() !== '') {
      const query = busca.trim();
      whereClause.OR = [
        { titulo: { contains: query } },
        { tipo: { contains: query } },
        { bairro: { contains: query } },
        { cidade: { contains: query } },
        { descricao: { contains: query } }
      ];
    }

    const imoveis = await prisma.imovel.findMany({
      where: whereClause,
      orderBy: { criadoEm: 'desc' }
    });

    return res.json(imoveis);
  } catch (err) {
    console.error('Erro ao buscar imóveis:', err);
    return res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
}

// Obter detalhes de um imóvel por ID + Análise IA
async function getImovelById(req, res) {
  try {
    const { id } = req.params;
    const imovel = await prisma.imovel.findUnique({
      where: { id },
      include: {
        propostas: {
          include: { cliente: { select: { id: true, nome: true, cidade: true } } },
          orderBy: { criadoEm: 'desc' }
        }
      }
    });

    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    // Gerar análise de inteligência artificial
    const aiAnalysis = await generateImovelAiAnalysis(imovel);

    return res.json({
      ...imovel,
      aiAnalysis
    });
  } catch (err) {
    console.error('Erro ao buscar imóvel por ID:', err);
    return res.status(500).json({ error: 'Erro ao carregar detalhes do imóvel.' });
  }
}

// Cadastrar novo Imóvel (Admin)
async function createImovel(req, res) {
  try {
    const { titulo, tipo, preco, cidade, bairro, endereco, quartos, banheiros, vagas, areaM2, fotoUrl, destaque, descricao } = req.body;

    if (!titulo || !tipo || !preco || !fotoUrl) {
      return res.status(400).json({ error: 'Campos essenciais (título, tipo, preço e foto) são obrigatórios.' });
    }

    const imovel = await prisma.imovel.create({
      data: {
        titulo,
        tipo: tipo || 'Apartamento',
        preco: parseFloat(preco),
        cidade: cidade || 'Pelotas',
        bairro: bairro || 'Centro',
        endereco: endereco || '',
        quartos: parseInt(quartos) || 1,
        banheiros: parseInt(banheiros) || 1,
        vagas: parseInt(vagas) || 0,
        areaM2: parseFloat(areaM2) || 50,
        fotoUrl,
        destaque: destaque === true || destaque === 'true',
        descricao: descricao || ''
      }
    });

    return res.status(201).json(imovel);
  } catch (err) {
    console.error('Erro ao criar imóvel:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar imóvel.' });
  }
}

// Editar Imóvel (Admin)
async function updateImovel(req, res) {
  try {
    const { id } = req.params;
    const { titulo, tipo, preco, cidade, bairro, endereco, quartos, banheiros, vagas, areaM2, fotoUrl, destaque, descricao } = req.body;

    const imovel = await prisma.imovel.update({
      where: { id },
      data: {
        titulo,
        tipo,
        preco: preco !== undefined ? parseFloat(preco) : undefined,
        cidade,
        bairro,
        endereco,
        quartos: quartos !== undefined ? parseInt(quartos) : undefined,
        banheiros: banheiros !== undefined ? parseInt(banheiros) : undefined,
        vagas: vagas !== undefined ? parseInt(vagas) : undefined,
        areaM2: areaM2 !== undefined ? parseFloat(areaM2) : undefined,
        fotoUrl,
        destaque: destaque !== undefined ? (destaque === true || destaque === 'true') : undefined,
        descricao
      }
    });

    return res.json(imovel);
  } catch (err) {
    console.error('Erro ao atualizar imóvel:', err);
    return res.status(500).json({ error: 'Erro ao atualizar dados do imóvel.' });
  }
}

// Alternar Destaque de um Imóvel (Admin)
async function toggleDestaque(req, res) {
  try {
    const { id } = req.params;
    const imovelAtual = await prisma.imovel.findUnique({ where: { id } });

    if (!imovelAtual) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    const imovel = await prisma.imovel.update({
      where: { id },
      data: { destaque: !imovelAtual.destaque }
    });

    return res.json({ message: 'Destaque atualizado com sucesso!', imovel });
  } catch (err) {
    console.error('Erro ao alternar destaque:', err);
    return res.status(500).json({ error: 'Erro ao alternar destaque.' });
  }
}

// Deletar Imóvel (Admin)
async function deleteImovel(req, res) {
  try {
    const { id } = req.params;
    await prisma.imovel.delete({ where: { id } });
    return res.json({ message: 'Imóvel removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir imóvel:', err);
    return res.status(500).json({ error: 'Erro ao excluir imóvel.' });
  }
}

module.exports = {
  getImoveis,
  getImovelById,
  createImovel,
  updateImovel,
  toggleDestaque,
  deleteImovel
};
