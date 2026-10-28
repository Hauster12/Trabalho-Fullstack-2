const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listVisitas(req, res) {
  try {
    const visitas = await prisma.visita.findMany({
      include: {
        imovel: {
          select: {
            id: true,
            titulo: true,
            bairro: true,
            cidade: true,
            endereco: true
          }
        }
      },
      orderBy: { inicio: 'asc' }
    });

    return res.json(visitas);
  } catch (err) {
    console.error('Erro ao listar visitas:', err);
    return res.status(500).json({ error: 'Erro ao carregar visitas da agenda.' });
  }
}

async function createVisita(req, res) {
  try {
    const {
      titulo,
      clienteNome,
      clienteTelefone,
      corretor,
      imovelId,
      inicio,
      fim,
      status,
      observacoes
    } = req.body;

    if (!titulo || !clienteNome || !inicio || !fim) {
      return res.status(400).json({
        error: 'Título, nome do cliente, início e término são obrigatórios.'
      });
    }

    const novaVisita = await prisma.visita.create({
      data: {
        titulo,
        clienteNome,
        clienteTelefone: clienteTelefone || null,
        corretor: corretor || 'André Santos',
        imovelId: imovelId || null,
        inicio: new Date(inicio),
        fim: new Date(fim),
        status: status || 'Confirmada',
        observacoes: observacoes || null
      },
      include: {
        imovel: true
      }
    });

    return res.status(201).json(novaVisita);
  } catch (err) {
    console.error('Erro ao criar visita:', err);
    return res.status(500).json({ error: 'Erro ao registrar visita na agenda.' });
  }
}

async function updateVisita(req, res) {
  try {
    const { id } = req.params;
    const {
      titulo,
      clienteNome,
      clienteTelefone,
      corretor,
      imovelId,
      inicio,
      fim,
      status,
      observacoes
    } = req.body;

    const dataToUpdate = {};
    if (titulo !== undefined) dataToUpdate.titulo = titulo;
    if (clienteNome !== undefined) dataToUpdate.clienteNome = clienteNome;
    if (clienteTelefone !== undefined) dataToUpdate.clienteTelefone = clienteTelefone;
    if (corretor !== undefined) dataToUpdate.corretor = corretor;
    if (imovelId !== undefined) dataToUpdate.imovelId = imovelId || null;
    if (inicio !== undefined) dataToUpdate.inicio = new Date(inicio);
    if (fim !== undefined) dataToUpdate.fim = new Date(fim);
    if (status !== undefined) dataToUpdate.status = status;
    if (observacoes !== undefined) dataToUpdate.observacoes = observacoes;

    const visitaAtualizada = await prisma.visita.update({
      where: { id },
      data: dataToUpdate,
      include: {
        imovel: true
      }
    });

    return res.json(visitaAtualizada);
  } catch (err) {
    console.error('Erro ao atualizar visita:', err);
    return res.status(500).json({ error: 'Erro ao atualizar dados da visita.' });
  }
}

async function deleteVisita(req, res) {
  try {
    const { id } = req.params;

    await prisma.visita.delete({
      where: { id }
    });

    return res.json({ message: 'Visita removida com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir visita:', err);
    return res.status(500).json({ error: 'Erro ao remover visita da agenda.' });
  }
}

module.exports = {
  listVisitas,
  createVisita,
  updateVisita,
  deleteVisita
};
