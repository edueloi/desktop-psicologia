const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const knex = require('knex');
const knexConfig = require('../knexfile');

console.log('[SERVER] Carregando módulos...');

const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const dashboardRoutes = require('./routes/dashboard');
const kanbanRoutes = require('./routes/kanban');
const billingRoutes = require('./routes/billing');
const reportsRoutes = require('./routes/reports');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const notificationsRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');

console.log('[SERVER] Módulos carregados ✓');

const app = express();
const PORT = 3456;

// Middleware
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Garantir UTF-8 em todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Determinar o diretório de dados correto
let dataDir;
if (process.env.PORTABLE_EXECUTABLE_DIR) {
  // Se for a versão instalada do Electron, usar userData
  dataDir = process.env.PORTABLE_EXECUTABLE_DIR;
} else if (process.env.NODE_ENV === 'production' && process.resourcesPath) {
  // Em produção, salvar fora do .asar
  dataDir = path.join(path.dirname(process.resourcesPath), 'data');
} else {
  // Em desenvolvimento
  dataDir = path.join(__dirname, '..', 'data');
}

const dbDir = path.join(dataDir, 'db');
const filesDir = path.join(dataDir, 'files');

// Garantir que os diretórios existem
[dataDir, dbDir, filesDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Diretório criado: ${dir}`);
    }
  } catch (error) {
    console.error(`Erro ao criar diretório ${dir}:`, error.message);
  }
});

// Inicializar banco de dados
const env = process.env.NODE_ENV || 'development';
console.log('[SERVER] Inicializando banco de dados... Ambiente:', env);
const db = knex(knexConfig[env]);
console.log('[SERVER] Conexão com banco criada ✓');

// IMPORTANTE: Adicionar db ao request ANTES de executar migrations
app.use((req, res, next) => {
  req.db = db;
  next();
});
console.log('[SERVER] Middleware req.db registrado ✓');

// Função para aplicar migrações manualmente via SQL
async function applyManualMigrations() {
  try {
    console.log('Aplicando migrações manuais...');
    
    // Verificar se as colunas existem
    const tableInfo = await db.raw('PRAGMA table_info(appointments)');
    const columnNames = tableInfo.map(col => col.name);
    
    // Verificar se patient_id é nullable
    const patientIdCol = tableInfo.find(col => col.name === 'patient_id');
    const needsPatientIdNullable = patientIdCol && patientIdCol.notnull === 1;
    
    if (needsPatientIdNullable) {
      console.log('  ! Tornando patient_id nullable...');
      // SQLite não suporta ALTER COLUMN, então precisamos recriar a tabela
      await db.raw('PRAGMA foreign_keys=off');
      await db.raw('BEGIN TRANSACTION');
      
      // Criar tabela temporária com patient_id nullable
      await db.raw(`
        CREATE TABLE appointments_new (
          id VARCHAR(255) PRIMARY KEY,
          patient_id VARCHAR(255) NULL,
          date_time DATETIME NOT NULL,
          end_time DATETIME NOT NULL,
          duration INTEGER DEFAULT 60,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'agendado',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          valor DECIMAL(10,2),
          tipo_sessao VARCHAR(50),
          metodo_pagamento VARCHAR(50),
          status_pagamento VARCHAR(20) DEFAULT 'pendente',
          is_recorrente BOOLEAN DEFAULT 0,
          frequencia VARCHAR(20),
          intervalo INTEGER DEFAULT 1,
          data_termino_recorrencia DATE,
          grupo_recorrencia VARCHAR(255),
          is_evento BOOLEAN DEFAULT 0,
          tipo_evento VARCHAR(50),
          cor VARCHAR(20),
          FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
        )
      `);
      
      // Copiar dados (com valores padrão para colunas faltantes)
      const columns = tableInfo.map(col => col.name).join(', ');
      await db.raw(`INSERT INTO appointments_new (${columns}) SELECT ${columns} FROM appointments`);
      
      // Remover tabela antiga
      await db.raw('DROP TABLE appointments');
      
      // Renomear nova tabela
      await db.raw('ALTER TABLE appointments_new RENAME TO appointments');
      
      await db.raw('COMMIT');
      await db.raw('PRAGMA foreign_keys=on');
      console.log('  ✓ patient_id agora é nullable');
      
      // Recarregar informações da tabela
      const newTableInfo = await db.raw('PRAGMA table_info(appointments)');
      columnNames.length = 0;
      columnNames.push(...newTableInfo.map(col => col.name));
    }
    
    // Adicionar colunas faltantes
    const columnsToAdd = [
      { name: 'valor', sql: 'ALTER TABLE appointments ADD COLUMN valor DECIMAL(10,2)' },
      { name: 'tipo_sessao', sql: 'ALTER TABLE appointments ADD COLUMN tipo_sessao VARCHAR(50)' },
      { name: 'metodo_pagamento', sql: 'ALTER TABLE appointments ADD COLUMN metodo_pagamento VARCHAR(50)' },
      { name: 'status_pagamento', sql: "ALTER TABLE appointments ADD COLUMN status_pagamento VARCHAR(20) DEFAULT 'pendente'" },
      { name: 'is_recorrente', sql: 'ALTER TABLE appointments ADD COLUMN is_recorrente BOOLEAN DEFAULT 0' },
      { name: 'frequencia', sql: 'ALTER TABLE appointments ADD COLUMN frequencia VARCHAR(20)' },
      { name: 'intervalo', sql: 'ALTER TABLE appointments ADD COLUMN intervalo INTEGER DEFAULT 1' },
      { name: 'data_termino_recorrencia', sql: 'ALTER TABLE appointments ADD COLUMN data_termino_recorrencia DATE' },
      { name: 'grupo_recorrencia', sql: 'ALTER TABLE appointments ADD COLUMN grupo_recorrencia VARCHAR(255)' },
      { name: 'is_evento', sql: 'ALTER TABLE appointments ADD COLUMN is_evento BOOLEAN DEFAULT 0' },
      { name: 'tipo_evento', sql: 'ALTER TABLE appointments ADD COLUMN tipo_evento VARCHAR(50)' },
      { name: 'cor', sql: 'ALTER TABLE appointments ADD COLUMN cor VARCHAR(20)' },
    ];
    
    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        await db.raw(col.sql);
        console.log(`  ✓ Adicionada coluna: ${col.name}`);
      }
    }
    
    // Criar tabelas do Kanban se não existirem
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.map(t => t.name);
    
    if (!tableNames.includes('kanban_boards')) {
      await db.raw(`
        CREATE TABLE kanban_boards (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          position INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('  ✓ Tabela criada: kanban_boards');
    }
    
    if (!tableNames.includes('kanban_columns')) {
      await db.raw(`
        CREATE TABLE kanban_columns (
          id VARCHAR(255) PRIMARY KEY,
          board_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          color VARCHAR(20),
          position INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (board_id) REFERENCES kanban_boards(id) ON DELETE CASCADE
        )
      `);
      console.log('  ✓ Tabela criada: kanban_columns');
    }
    
    if (!tableNames.includes('kanban_cards')) {
      await db.raw(`
        CREATE TABLE kanban_cards (
          id VARCHAR(255) PRIMARY KEY,
          column_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          patient_id VARCHAR(255),
          appointment_id VARCHAR(255),
          priority VARCHAR(20) DEFAULT 'media',
          due_date DATE,
          position INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (column_id) REFERENCES kanban_columns(id) ON DELETE CASCADE,
          FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
          FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
        )
      `);
      console.log('  ✓ Tabela criada: kanban_cards');
    }
    
    console.log('✓ Migrações manuais aplicadas com sucesso');
  } catch (error) {
    console.error('Erro ao aplicar migrações manuais:', error.message);
  }
}

// Executar migrations automaticamente com timeout (não bloqueia o servidor)
console.log('[SERVER] Iniciando migrations...');
Promise.race([
  db.migrate.latest(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Migration timeout após 10s')), 10000))
])
  .then(() => {
    console.log('✓ Migrations executadas com sucesso');
    // Executar seeds apenas se não houver usuários
    return db('users').count('* as count').first();
  })
  .then((result) => {
    if (result && result.count === 0) {
      return db.seed.run().then(() => {
        console.log('✓ Seeds executadas - usuário admin criado');
      });
    } else if (result) {
      console.log('✓ Banco de dados já possui dados');
    }
  })
  .catch(async (err) => {
    console.error('⚠ Erro/Timeout ao executar migrations:', err.message);
    console.log('→ Servidor vai iniciar mesmo assim...');
  });

// Rotas (db já foi adicionado ao request acima)
console.log('[SERVER] Registrando rotas...');
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kanban', kanbanRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
console.log('[SERVER] Rotas registradas ✓');

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`✓ Servidor Express rodando na porta ${PORT}`);
      console.log(`✓ Diretório de dados: ${dataDir}`);
      console.log(`✓ Banco de dados: ${path.join(dbDir, 'app.db')}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

module.exports = { startServer, app, dataDir, dbDir, filesDir };
