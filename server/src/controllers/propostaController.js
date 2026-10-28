const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Criar nova Proposta (Cliente logado)
async function createProposta(req, res) {
  try {
    const { imovelId, clienteId, valorProposta, mensagem } = req.body;

    if (!imovelId || !clienteId || !valorProposta || !mensagem) {
      return res.status(400).json({ error: 'Imóvel, cliente, valor e mensagem da proposta são obrigatórios.' });
    }

    // Verificar se imóvel existe
    const imovel = await prisma.imovel.findUnique({ where: { id: imovelId } });
    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }

    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não cadastrado no sistema.' });
    }

    const proposta = await prisma.proposta.create({
      data: {
        imovelId,
        clienteId,
        valorProposta: parseFloat(valorProposta),
        mensagem,
        status: 'Pendente'
      },
      include: {
        imovel: { select: { titulo: true, preco: true, fotoUrl: true, cidade: true } }
      }
    });

    return res.status(201).json({
      message: 'Proposta enviada com sucesso! Aguarde o retorno da nossa equipe.',
      proposta
    });
  } catch (err) {
    console.error('Erro ao enviar proposta:', err);
    return res.status(500).json({ error: 'Erro interno ao registrar proposta.' });
  }
}

// Listar propostas enviadas por um Cliente (Minhas Propostas)
async function getPropostasByCliente(req, res) {
  try {
    const { clienteId } = req.params;

    const propostas = await prisma.proposta.findMany({
      where: { clienteId },
      include: {
        imovel: {
          select: {
            id: true,
            titulo: true,
            preco: true,
            fotoUrl: true,
            cidade: true,
            bairro: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    return res.json(propostas);
  } catch (err) {
    console.error('Erro ao listar propostas do cliente:', err);
    return res.status(500).json({ error: 'Erro ao carregar suas propostas.' });
  }
}

// Listar todas as propostas para o Painel Admin
async function getAllPropostas(req, res) {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        imovel: { select: { id: true, titulo: true, preco: true, fotoUrl: true, cidade: true } },
        cliente: { select: { id: true, nome: true, email: true, telefone: true, cidade: true } }
      },
      orderBy: { criadoEm: 'desc' }
    });

    return res.json(propostas);
  } catch (err) {
    console.error('Erro ao listar propostas no admin:', err);
    return res.status(500).json({ error: 'Erro ao carregar propostas dos clientes.' });
  }
}

// Responder Proposta do Cliente (Admin)
async function respondProposta(req, res) {
  try {
    const { id } = req.params;
    const { respostaAdmin, status } = req.body;

    if (!respostaAdmin || !status) {
      return res.status(400).json({ error: 'Resposta e status são obrigatórios.' });
    }

    const proposta = await prisma.proposta.update({
      where: { id },
      data: {
        respostaAdmin,
        status,
        respondidoEm: new Date()
      },
      include: {
        cliente: { select: { nome: true, email: true } },
        imovel: { select: { titulo: true } }
      }
    });

    return res.json({
      message: 'Resposta enviada com sucesso ao cliente!',
      proposta
    });
  } catch (err) {
    console.error('Erro ao responder proposta:', err);
    return res.status(500).json({ error: 'Erro ao salvar resposta da proposta.' });
  }
}

// Deletar Proposta (Admin)
async function deleteProposta(req, res) {
  try {
    const { id } = req.params;
    await prisma.proposta.delete({ where: { id } });
    return res.json({ message: 'Proposta removida com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir proposta:', err);
    return res.status(500).json({ error: 'Erro ao excluir proposta.' });
  }
}

module.exports = {
  createProposta,
  getPropostasByCliente,
  getAllPropostas,
  respondProposta,
  deleteProposta
};
