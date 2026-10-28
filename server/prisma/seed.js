const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding do banco de dados ImobiSelect...');

  // Limpar tabelas existentes
  await prisma.visita.deleteMany();
  await prisma.proposta.deleteMany();
  await prisma.imovel.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.admin.deleteMany();

  // Senhas criptografadas
  const passwordHash = await bcrypt.hash('123456', 10);

  // Criar Admin
  const admin = await prisma.admin.create({
    data: {
      nome: 'André Santos (Gerente)',
      email: 'admin@imobisenac.com',
      senha: passwordHash,
      cargo: 'Diretor Comercial'
    }
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // Criar Clientes de Teste
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'Maria Souza',
      email: 'maria@gmail.com',
      senha: passwordHash,
      telefone: '(53) 99123-4567',
      cidade: 'Pelotas'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Silvana Santos',
      email: 'sil@gmail.com',
      senha: passwordHash,
      telefone: '(53) 98877-6655',
      cidade: 'Bagé'
    }
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nome: 'Pedro Moraes',
      email: 'pedro@gmail.com',
      senha: passwordHash,
      telefone: '(53) 99988-1122',
      cidade: 'Rio Grande'
    }
  });

  console.log('✅ 3 Clientes criados');

  // Criar Imóveis
  const imovel1 = await prisma.imovel.create({
    data: {
      titulo: 'Residencial Laranjal Premium',
      tipo: 'Casa',
      preco: 890000,
      cidade: 'Pelotas',
      bairro: 'Laranjal',
      endereco: 'Av. Doutor Antônio Augusto Assumpção, 450',
      quartos: 4,
      banheiros: 3,
      vagas: 2,
      areaM2: 240,
      destaque: true,
      fotoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      descricao: 'Excelente casa de alto padrão com vista privilegiada, ampla área gourmet com churrasqueira, suíte master com closet e piscina privativa.'
    }
  });

  const imovel2 = await prisma.imovel.create({
    data: {
      titulo: 'Apartamento Design Parque Dom Antônio',
      tipo: 'Apartamento',
      preco: 425000,
      cidade: 'Pelotas',
      bairro: 'Areal',
      endereco: 'Rua Professor Araújo, 1200',
      quartos: 3,
      banheiros: 2,
      vagas: 1,
      areaM2: 95,
      destaque: true,
      fotoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      descricao: 'Apartamento moderno com fino acabamento, móveis planejados na cozinha e quartos, sacada com churrasqueira e condomínio com infraestrutura completa.'
    }
  });

  const imovel3 = await prisma.imovel.create({
    data: {
      titulo: 'Cobertura Duplex Centro Histórico',
      tipo: 'Cobertura',
      preco: 1150000,
      cidade: 'Pelotas',
      bairro: 'Centro',
      endereco: 'Rua XV de Novembro, 890',
      quartos: 4,
      banheiros: 4,
      vagas: 3,
      areaM2: 310,
      destaque: true,
      fotoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      descricao: 'Espaçosa cobertura duplex no coração de Pelotas, com terraço privativo, jacuzzi, lareira e isolamento acústico aprimorado.'
    }
  });

  const imovel4 = await prisma.imovel.create({
    data: {
      titulo: 'Sobrado Contemporâneo Bagé',
      tipo: 'Casa',
      preco: 580000,
      cidade: 'Bagé',
      bairro: 'Getúlio Vargas',
      endereco: 'Av. Portugal, 340',
      quartos: 3,
      banheiros: 2,
      vagas: 2,
      areaM2: 180,
      destaque: false,
      fotoUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      descricao: 'Sobrado seminovo em bairro residencial tranquilo, pátio amplo com árvores frutíferas e excelente iluminação natural.'
    }
  });

  const imovel5 = await prisma.imovel.create({
    data: {
      titulo: 'Apartamento Beira-Mar Cassino',
      tipo: 'Apartamento',
      preco: 690000,
      cidade: 'Rio Grande',
      bairro: 'Cassino',
      endereco: 'Av. Beira Mar, 150',
      quartos: 2,
      banheiros: 2,
      vagas: 1,
      areaM2: 82,
      destaque: false,
      fotoUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      descricao: 'Apartamento frente ao mar no Balneário Cassino, totalmente mobiliado, sacada panorâmica e condomínio fechado com portaria 24h.'
    }
  });

  console.log('✅ 5 Imóveis criados');

  // Criar Propostas de Exemplo
  await prisma.proposta.create({
    data: {
      imovelId: imovel1.id,
      clienteId: cliente1.id,
      valorProposta: 850000,
      mensagem: 'Oferta à vista R$ 850 mil com entrada imediata.',
      status: 'Em Analise',
      respostaAdmin: 'Recebemos a proposta. Faremos contato até sábado para alinhar as condições.',
      respondidoEm: new Date()
    }
  });

  await prisma.proposta.create({
    data: {
      imovelId: imovel2.id,
      clienteId: cliente2.id,
      valorProposta: 400000,
      mensagem: 'Aceita R$ 300 mil de entrada + saldo via financiamento bancário?',
      status: 'Aceita',
      respostaAdmin: 'Proposta aceita! Entre em contato com nossa equipe de financiamento.',
      respondidoEm: new Date()
    }
  });

  await prisma.proposta.create({
    data: {
      imovelId: imovel3.id,
      clienteId: cliente3.id,
      valorProposta: 1050000,
      mensagem: 'Proposta de R$ 1.050.000,00 com entrega de um apartamento menor na negociação.',
      status: 'Pendente',
      respostaAdmin: null
    }
  });

  console.log('✅ 3 Propostas de exemplo criadas');

  // Criar Visitas de Exemplo (para o react-big-calendar)
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth(); // mês atual
  const dia = agora.getDate();

  await prisma.visita.create({
    data: {
      titulo: 'Visita: Casa Laranjal (Mariana)',
      clienteNome: 'Mariana Souza',
      clienteTelefone: '(53) 99123-4567',
      corretor: 'André Santos',
      imovelId: imovel1.id,
      inicio: new Date(ano, mes, dia, 14, 0),
      fim: new Date(ano, mes, dia, 15, 30),
      status: 'Confirmada',
      observacoes: 'Cliente busca imóvel amplo perto da praia. Apresentar área gourmet.'
    }
  });

  await prisma.visita.create({
    data: {
      titulo: 'Visita: Apto Centro (Pedro)',
      clienteNome: 'Pedro Moraes',
      clienteTelefone: '(53) 99988-1122',
      corretor: 'André Santos',
      imovelId: imovel2.id,
      inicio: new Date(ano, mes, dia + 1, 10, 0),
      fim: new Date(ano, mes, dia + 1, 11, 0),
      status: 'Confirmada',
      observacoes: 'Cliente tem interesse em financiamento Caixa. Chaves na portaria.'
    }
  });

  await prisma.visita.create({
    data: {
      titulo: 'Avaliação Presencial: Cobertura Gonçalves',
      clienteNome: 'Silvana Santos',
      clienteTelefone: '(53) 98877-6655',
      corretor: 'André Santos',
      imovelId: imovel3.id,
      inicio: new Date(ano, mes, dia + 2, 16, 0),
      fim: new Date(ano, mes, dia + 2, 17, 30),
      status: 'Pendente',
      observacoes: 'Acompanhar com arquiteto do cliente.'
    }
  });

  // Visita no dia 05/11 (primeiro dia de apresentações)
  await prisma.visita.create({
    data: {
      titulo: 'Demonstração de Visita - UniSenac',
      clienteNome: 'Prof. Edécio Iepsen',
      clienteTelefone: '(53) 98400-0000',
      corretor: 'André Santos',
      imovelId: imovel1.id,
      inicio: new Date(2026, 10, 5, 19, 30), // Novembro é mês 10 (0-indexed)
      fim: new Date(2026, 10, 5, 21, 0),
      status: 'Confirmada',
      observacoes: 'Apresentação Trabalho #2 - Integração de Agenda react-big-calendar.'
    }
  });

  // Visita no dia 12/11 (segundo dia de apresentações)
  await prisma.visita.create({
    data: {
      titulo: 'Reunião de Fechamento de Contrato',
      clienteNome: 'Carlos Eduardo Ferreira',
      clienteTelefone: '(53) 99111-2233',
      corretor: 'André Santos',
      imovelId: imovel3.id,
      inicio: new Date(2026, 10, 12, 14, 0),
      fim: new Date(2026, 10, 12, 15, 30),
      status: 'Confirmada',
      observacoes: 'Assinatura de escritura e entrega das chaves.'
    }
  });

  console.log('✅ Visitas de exemplo criadas na agenda');
  console.log('🌱 Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
