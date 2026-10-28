const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationCodeEmail } = require('../services/emailService');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'imobi_senac_secret_key_2026';

// Solicitar Envio do Código de Verificação para o E-mail
async function sendVerificationCode(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'O e-mail é obrigatório para envio do código.' });
    }

    // Checar se e-mail já existe
    const existing = await prisma.cliente.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema. Faça login.' });
    }

    // Gerar código numérico de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiraEm = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Remover códigos antigos para o mesmo e-mail
    await prisma.codigoVerificacao.deleteMany({ where: { email } });

    // Salvar novo código
    await prisma.codigoVerificacao.create({
      data: {
        email,
        codigo,
        expiraEm
      }
    });

    // Enviar por e-mail via Nodemailer
    await sendVerificationCodeEmail(email, codigo);

    return res.json({
      message: `Código de verificação enviado para ${email}.`,
      devCode: codigo // Código retornado para auxílio nos testes locais
    });
  } catch (err) {
    console.error('Erro ao enviar código de verificação:', err);
    return res.status(500).json({ error: 'Erro ao gerar código de verificação por e-mail.' });
  }
}

// Registro de Cliente com Validação do Código de 6 Dígitos
async function registerCliente(req, res) {
  try {
    const { nome, email, senha, telefone, cidade, codigo } = req.body;

    if (!nome || !email || !senha || !codigo) {
      return res.status(400).json({ error: 'Nome, e-mail, senha e código de verificação são obrigatórios.' });
    }

    // Verificar e-mail repetido
    const existing = await prisma.cliente.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema.' });
    }

    // Validar o código de verificação
    const registroCodigo = await prisma.codigoVerificacao.findFirst({
      where: {
        email,
        codigo,
        expiraEm: { gte: new Date() }
      }
    });

    if (!registroCodigo) {
      return res.status(400).json({ error: 'Código de verificação inválido ou expirado. Solicite um novo código.' });
    }

    // Criptografar senha e criar o cliente
    const senhaHash = await bcrypt.hash(senha, 10);
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone: telefone || '',
        cidade: cidade || 'Pelotas'
      }
    });

    // Limpar código usado
    await prisma.codigoVerificacao.deleteMany({ where: { email } });

    const token = jwt.sign({ id: cliente.id, role: 'cliente' }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Cliente verificado e cadastrado com sucesso!',
      clienteKey: cliente.id,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cidade: cliente.cidade
      },
      token
    });
  } catch (err) {
    console.error('Erro no registro de cliente:', err);
    return res.status(500).json({ error: 'Erro interno no servidor ao registrar cliente.' });
  }
}

// Login de Cliente
async function loginCliente(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(senha, cliente.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: cliente.id, role: 'cliente' }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login realizado com sucesso!',
      clienteKey: cliente.id,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cidade: cliente.cidade
      },
      token
    });
  } catch (err) {
    console.error('Erro no login de cliente:', err);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

// Recuperar Sessão do Cliente via UUID (LocalStorage check)
async function getClienteByUuid(req, res) {
  try {
    const { uuid } = req.params;
    const cliente = await prisma.cliente.findUnique({ where: { id: uuid } });

    if (!cliente) {
      return res.status(404).json({ error: 'Sessão expirada ou cliente não encontrado.' });
    }

    return res.json({
      clienteKey: cliente.id,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cidade: cliente.cidade
      }
    });
  } catch (err) {
    console.error('Erro ao buscar cliente por UUID:', err);
    return res.status(500).json({ error: 'Erro ao buscar sessão do cliente.' });
  }
}

// Login do Administrador
async function loginAdmin(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais administrativas inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, admin.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais administrativas inválidas.' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      message: 'Acesso restrito concedido.',
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        cargo: admin.cargo
      },
      token
    });
  } catch (err) {
    console.error('Erro no login de admin:', err);
    return res.status(500).json({ error: 'Erro interno no login do admin.' });
  }
}

module.exports = {
  sendVerificationCode,
  registerCliente,
  loginCliente,
  getClienteByUuid,
  loginAdmin
};
