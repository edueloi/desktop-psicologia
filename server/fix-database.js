const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '..', 'psychdesk.db');

console.log('Conectando ao banco:', dbPath);
const db = new Database(dbPath);

// Verificar se as colunas já existem
const checkColumn = (table, column) => {
  const result = db.prepare(`PRAGMA table_info(${table})`).all();
  return result.some(col => col.name === column);
};

// Verificar se a tabela existe
const checkTable = (table) => {
  const result = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
  return !!result;
};

try {
  // Função para recriar a tabela appointments com patient_id nulo
  const recreateAppointmentsTable = () => {
    console.log('\n=== Recriando a tabela appointments ===\n');

    // 1. Renomear a tabela antiga
    db.prepare('ALTER TABLE appointments RENAME TO appointments_old').run();
    console.log('✓ Tabela appointments renomeada para appointments_old');

    // 2. Criar a nova tabela com a estrutura correta
    db.prepare(`
      CREATE TABLE appointments (
        id VARCHAR(255) PRIMARY KEY,
        patient_id VARCHAR(255) REFERENCES patients(id) ON DELETE CASCADE,
        date_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        duration INTEGER DEFAULT 60,
        status VARCHAR(255) NOT NULL DEFAULT 'agendado',
        notes TEXT,
        valor DECIMAL(10, 2),
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
        cor VARCHAR(20)
      )
    `).run();
    console.log('✓ Nova tabela appointments criada com patient_id nulo');

    // 3. Copiar os dados da tabela antiga para a nova
    db.prepare(`
      INSERT INTO appointments (id, patient_id, date_time, end_time, duration, status, notes, valor, tipo_sessao, metodo_pagamento, status_pagamento, is_recorrente, frequencia, intervalo, data_termino_recorrencia, grupo_recorrencia, is_evento, tipo_evento, cor)
      SELECT id, patient_id, date_time, end_time, duration, status, notes, valor, tipo_sessao, metodo_pagamento, status_pagamento, is_recorrente, frequencia, intervalo, data_termino_recorrencia, grupo_recorrencia, is_evento, tipo_evento, cor FROM appointments_old
    `).run();
    console.log('✓ Dados copiados para a nova tabela appointments');

    // 4. Remover a tabela antiga
    db.prepare('DROP TABLE appointments_old').run();
    console.log('✓ Tabela appointments_old removida');
  };

  // Verificar se a coluna patient_id é "NOT NULL"
  const appointmentsInfo = db.prepare("PRAGMA table_info(appointments)").all();
  const patientIdColumn = appointmentsInfo.find(col => col.name === 'patient_id');

  if (patientIdColumn && patientIdColumn.notnull) {
    console.log('✗ Coluna patient_id em appointments é NOT NULL. Recriando a tabela...');
    recreateAppointmentsTable();
  } else {
    console.log('✓ Coluna patient_id em appointments já permite nulos.');
  }
  
  console.log('\n=== Verificando estrutura do banco ===\n');
  
  // Verificar colunas da tabela appointments
  const appointmentsColumns = [
    'valor', 'tipo_sessao', 'metodo_pagamento', 'status_pagamento',
    'is_recorrente', 'frequencia', 'intervalo', 'data_termino_recorrencia',
    'grupo_recorrencia', 'is_evento', 'tipo_evento', 'cor'
  ];
  
  console.log('Verificando colunas da tabela appointments:');
  appointmentsColumns.forEach(col => {
    const exists = checkColumn('appointments', col);
    console.log(`  ${col}: ${exists ? '✓ existe' : '✗ não existe'}`);
  });
  
  // Adicionar colunas faltantes
  console.log('\n=== Adicionando colunas faltantes ===\n');
  
  if (!checkColumn('appointments', 'valor')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN valor DECIMAL(10,2)').run();
    console.log('✓ Adicionada coluna: valor');
  }
  
  if (!checkColumn('appointments', 'tipo_sessao')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN tipo_sessao VARCHAR(50)').run();
    console.log('✓ Adicionada coluna: tipo_sessao');
  }
  
  if (!checkColumn('appointments', 'metodo_pagamento')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN metodo_pagamento VARCHAR(50)').run();
    console.log('✓ Adicionada coluna: metodo_pagamento');
  }
  
  if (!checkColumn('appointments', 'status_pagamento')) {
    db.prepare("ALTER TABLE appointments ADD COLUMN status_pagamento VARCHAR(20) DEFAULT 'pendente'").run();
    console.log('✓ Adicionada coluna: status_pagamento');
  }
  
  if (!checkColumn('appointments', 'is_recorrente')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN is_recorrente BOOLEAN DEFAULT 0').run();
    console.log('✓ Adicionada coluna: is_recorrente');
  }
  
  if (!checkColumn('appointments', 'frequencia')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN frequencia VARCHAR(20)').run();
    console.log('✓ Adicionada coluna: frequencia');
  }
  
  if (!checkColumn('appointments', 'intervalo')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN intervalo INTEGER DEFAULT 1').run();
    console.log('✓ Adicionada coluna: intervalo');
  }
  
  if (!checkColumn('appointments', 'data_termino_recorrencia')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN data_termino_recorrencia DATE').run();
    console.log('✓ Adicionada coluna: data_termino_recorrencia');
  }
  
  if (!checkColumn('appointments', 'grupo_recorrencia')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN grupo_recorrencia VARCHAR(255)').run();
    console.log('✓ Adicionada coluna: grupo_recorrencia');
  }
  
  if (!checkColumn('appointments', 'is_evento')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN is_evento BOOLEAN DEFAULT 0').run();
    console.log('✓ Adicionada coluna: is_evento');
  }
  
  if (!checkColumn('appointments', 'tipo_evento')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN tipo_evento VARCHAR(50)').run();
    console.log('✓ Adicionada coluna: tipo_evento');
  }
  
  if (!checkColumn('appointments', 'cor')) {
    db.prepare('ALTER TABLE appointments ADD COLUMN cor VARCHAR(20)').run();
    console.log('✓ Adicionada coluna: cor');
  }
  
  // Criar tabelas do Kanban
  console.log('\n=== Criando tabelas do Kanban ===\n');
  
  if (!checkTable('kanban_boards')) {
    db.prepare(`
      CREATE TABLE kanban_boards (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        position INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log('✓ Tabela criada: kanban_boards');
  } else {
    console.log('  kanban_boards: já existe');
  }
  
  if (!checkTable('kanban_columns')) {
    db.prepare(`
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
    `).run();
    console.log('✓ Tabela criada: kanban_columns');
  } else {
    console.log('  kanban_columns: já existe');
  }
  
  if (!checkTable('kanban_cards')) {
    db.prepare(`
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
    `).run();
    console.log('✓ Tabela criada: kanban_cards');
  } else {
    console.log('  kanban_cards: já existe');
  }
  
  console.log('\n✅ Banco de dados atualizado com sucesso!\n');
  
} catch (error) {
  console.error('\n❌ Erro ao atualizar banco:', error.message);
  console.error(error);
} finally {
  db.close();
}
