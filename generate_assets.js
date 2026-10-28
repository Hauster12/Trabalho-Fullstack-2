const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, 'slides_apresentacao');

function createVSCodeHTML(filename, filepath, codeLines, highlightLineRange = null) {
  const lineNumbersHtml = codeLines
    .map((_, i) => `<span class="line-num">${i + 1}</span>`)
    .join('\n');

  const codeHtml = codeLines
    .map((line, i) => {
      const isHighlighted = highlightLineRange && (i + 1 >= highlightLineRange[0] && i + 1 <= highlightLineRange[1]);
      return `<div class="code-line ${isHighlighted ? 'highlight' : ''}">${escapeHtml(line)}</div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #181818;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .vscode-window {
      width: 1100px;
      background: #1e1e1e;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08);
      color: #d4d4d4;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace;
      font-size: 14.5px;
      line-height: 1.6;
    }
    .title-bar {
      background: #323233;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #252526;
    }
    .window-controls {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .window-title {
      font-size: 12px;
      color: #999;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 500;
    }
    .tab-bar {
      background: #252526;
      display: flex;
      border-bottom: 1px solid #1e1e1e;
    }
    .tab {
      background: #1e1e1e;
      color: #ffffff;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      border-top: 2px solid #007acc;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .tab-icon {
      color: #4ec9b0;
      font-weight: bold;
    }
    .breadcrumbs {
      background: #1e1e1e;
      padding: 6px 16px;
      font-size: 12px;
      color: #888;
      border-bottom: 1px solid #282828;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .editor-body {
      display: flex;
      padding: 16px 0;
      background: #1e1e1e;
    }
    .line-numbers {
      display: flex;
      flex-direction: column;
      padding: 0 16px 0 16px;
      text-align: right;
      color: #6e7681;
      user-select: none;
      min-width: 45px;
      border-right: 1px solid #2a2a2a;
    }
    .code-content {
      flex: 1;
      padding-left: 16px;
      overflow-x: auto;
    }
    .code-line {
      white-space: pre;
    }
    .highlight {
      background: rgba(38, 79, 120, 0.35);
      border-left: 3px solid #007acc;
      padding-left: 5px;
      margin-left: -8px;
    }
    /* Syntax styling tokens */
    .kw { color: #569cd6; font-weight: bold; }
    .fn { color: #dcdcaa; }
    .str { color: #ce9178; }
    .type { color: #4ec9b0; }
    .cmt { color: #6a9955; font-style: italic; }
    .num { color: #b5cea8; }
    .tag { color: #4ec9b0; }
    .prop { color: #9cdcfe; }
  </style>
</head>
<body>
  <div class="vscode-window">
    <div class="title-bar">
      <div class="window-controls">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <div class="window-title">${filename} - imobi-senac - Visual Studio Code</div>
      <div style="width: 40px;"></div>
    </div>
    <div class="tab-bar">
      <div class="tab">
        <span class="tab-icon">📄</span>
        <span>${filename}</span>
      </div>
    </div>
    <div class="breadcrumbs">
      <span>imobi-senac</span> &gt; <span>${filepath.replace(/\\/g, ' &gt; ')}</span>
    </div>
    <div class="editor-body">
      <div class="line-numbers">
        ${lineNumbersHtml}
      </div>
      <div class="code-content">
        ${codeHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 1. Gera Print do Schema Prisma
const schemaPrismaCode = [
  '// Modelo de Imóvel com relacionamento para Visitas',
  'model Imovel {',
  '  id        String     @id @default(uuid())',
  '  titulo    String',
  '  tipo      String     // Apartamento, Casa, Cobertura, Terreno',
  '  preco     Float',
  '  cidade    String',
  '  bairro    String',
  '  endereco  String',
  '  quartos   Int',
  '  banheiros Int',
  '  vagas     Int',
  '  areaM2    Float',
  '  fotoUrl   String',
  '  destaque  Boolean    @default(false)',
  '  descricao String',
  '  criadoEm  DateTime   @default(now())',
  '  propostas Proposta[]',
  '  visitas   Visita[]   // Relacionamento com a nova Agenda',
  '}',
  '',
  '// Novo Modelo da Agenda de Visitas (Trabalho #2)',
  'model Visita {',
  '  id              String   @id @default(uuid())',
  '  titulo          String   // Ex: Visita Casa Laranjal (Mariana)',
  '  clienteNome     String',
  '  clienteTelefone String?',
  '  corretor        String   @default("André Santos")',
  '  imovelId        String?',
  '  imovel          Imovel?  @relation(fields: [imovelId], references: [id], onDelete: SetNull)',
  '  inicio          DateTime // Data e hora de início (start)',
  '  fim             DateTime // Data e hora de término (end)',
  '  status          String   @default("Confirmada") // Confirmada, Pendente, Realizada, Cancelada',
  '  observacoes     String?',
  '  criadoEm        DateTime @default(now())',
  '}'
];

// 2. Gera Print do Controller
const visitaControllerCode = [
  'const { PrismaClient } = require(\'@prisma/client\');',
  'const prisma = new PrismaClient();',
  '',
  '// Listar visitas para popular o calendário',
  'async function listVisitas(req, res) {',
  '  try {',
  '    const visitas = await prisma.visita.findMany({',
  '      include: {',
  '        imovel: { select: { id: true, titulo: true, bairro: true, cidade: true } }',
  '      },',
  '      orderBy: { inicio: \'asc\' }',
  '    });',
  '    return res.json(visitas);',
  '  } catch (err) {',
  '    return res.status(500).json({ error: \'Erro ao carregar visitas da agenda.\' });',
  '  }',
  '}',
  '',
  '// Criar agendamento de visita no banco SQLite',
  'async function createVisita(req, res) {',
  '  try {',
  '    const { titulo, clienteNome, clienteTelefone, corretor, imovelId, inicio, fim, status, observacoes } = req.body;',
  '    const novaVisita = await prisma.visita.create({',
  '      data: {',
  '        titulo, clienteNome, clienteTelefone, corretor, imovelId,',
  '        inicio: new Date(inicio),',
  '        fim: new Date(fim),',
  '        status: status || \'Confirmada\',',
  '        observacoes',
  '      },',
  '      include: { imovel: true }',
  '    });',
  '    return res.status(201).json(novaVisita);',
  '  } catch (err) {',
  '    return res.status(500).json({ error: \'Erro ao salvar visita.\' });',
  '  }',
  '}'
];

// 3. Gera Print do AdminAgenda.jsx (Configuração do react-big-calendar)
const adminAgendaCode = [
  'import { Calendar, dateFnsLocalizer, Views } from \'react-big-calendar\';',
  'import format from \'date-fns/format\';',
  'import parse from \'date-fns/parse\';',
  'import startOfWeek from \'date-fns/startOfWeek\';',
  'import getDay from \'date-fns/getDay\';',
  'import ptBR from \'date-fns/locale/pt-BR\';',
  'import \'react-big-calendar/lib/css/react-big-calendar.css\';',
  '',
  '// 1. Configuração do Localizer para Português (Brasil)',
  'const locales = { \'pt-BR\': ptBR };',
  'const localizer = dateFnsLocalizer({',
  '  format,',
  '  parse,',
  '  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),',
  '  getDay,',
  '  locales,',
  '});',
  '',
  '// 2. Componente de Calendário na Página',
  '<Calendar',
  '  localizer={localizer}',
  '  events={visitasFiltradas}',
  '  startAccessor="start"',
  '  endAccessor="end"',
  '  titleAccessor="title"',
  '  defaultView={Views.MONTH}',
  '  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}',
  '  selectable',
  '  onSelectSlot={handleSelectSlot}    // Clique para agendar novo horário',
  '  onSelectEvent={handleSelectEvent}  // Clique para ver detalhes e status',
  '  eventPropGetter={eventPropGetter}  // Cores dinâmicas por status',
  '  messages={calendarMessages}        // Tradução dos botões (Mês, Semana, Hoje)',
  '  culture="pt-BR"',
  '  style={{ height: 650 }}',
  '/>'
];

// 4. Gera Print de Rotas e Navegação
const routesCode = [
  '// client/src/components/AdminSidebar.jsx',
  '<NavLink to="/admin/agenda" className={({ isActive }) =>',
  '  `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? \'bg-emerald-600 text-white\' : \'text-slate-400\'}`',
  '}>',
  '  <Calendar className="w-4 h-4" />',
  '  Agenda de Visitas',
  '</NavLink>',
  '',
  '// client/src/App.jsx',
  '<Routes>',
  '  <Route path="/admin/login" element={<AdminLogin />} />',
  '  <Route path="/admin/dashboard" element={<AdminDashboard />} />',
  '  <Route path="/admin/imoveis" element={<AdminImoveis />} />',
  '  <Route path="/admin/propostas" element={<AdminPropostas />} />',
  '  <Route path="/admin/agenda" element={<AdminAgenda />} />',
  '</Routes>',
  '',
  '// server/src/index.js',
  'app.use(\'/api/visitas\', visitaRoutes);'
];

// Salva e renderiza os arquivos
const prints = [
  { file: 'print_01_schema_prisma', filename: 'schema.prisma', path: 'server/prisma/schema.prisma', code: schemaPrismaCode, range: [22, 34] },
  { file: 'print_02_visita_controller', filename: 'visitaController.js', path: 'server/src/controllers/visitaController.js', code: visitaControllerCode, range: [5, 17] },
  { file: 'print_03_admin_agenda_code', filename: 'AdminAgenda.jsx', path: 'client/src/pages/AdminAgenda.jsx', code: adminAgendaCode, range: [9, 16] },
  { file: 'print_04_sidebar_routes', filename: 'Rotas_e_Sidebar.jsx', path: 'client/src/App.jsx & AdminSidebar.jsx', code: routesCode, range: [1, 7] },
];

prints.forEach(p => {
  const htmlContent = createVSCodeHTML(p.filename, p.path, p.code, p.range);
  const htmlPath = path.join(outputDir, `${p.file}.html`);
  const pngPath = path.join(outputDir, `${p.file}.png`);
  fs.writeFileSync(htmlPath, htmlContent);

  console.log(`Renderizando ${p.file}.png...`);
  try {
    execSync(`"${edgePath}" --headless --no-sandbox --window-size=1200,850 --screenshot="${pngPath}" "${htmlPath}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Erro ao capturar ${p.file}:`, e.message);
  }
});

console.log('✅ Prints do VS Code gerados com sucesso!');
