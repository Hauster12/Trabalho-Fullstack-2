require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const imovelRoutes = require('./routes/imovelRoutes');
const propostaRoutes = require('./routes/propostaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visitaRoutes = require('./routes/visitaRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/imoveis', imovelRoutes);
app.use('/api/propostas', propostaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitas', visitaRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'ImobiSelect API - Senac pelotas',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      imoveis: '/api/imoveis',
      propostas: '/api/propostas',
      admin: '/api/admin',
      visitas: '/api/visitas'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ImobiSelect rodando na porta ${PORT}`);
  console.log(`📍 URL Local: http://localhost:${PORT}`);
});
