-- Script para adicionar colunas manualmente ao banco de dados

-- Adicionar colunas de billing e recorrência
ALTER TABLE appointments ADD COLUMN valor DECIMAL(10,2);
ALTER TABLE appointments ADD COLUMN tipo_sessao VARCHAR(50);
ALTER TABLE appointments ADD COLUMN metodo_pagamento VARCHAR(50);
ALTER TABLE appointments ADD COLUMN status_pagamento VARCHAR(20) DEFAULT 'pendente';
ALTER TABLE appointments ADD COLUMN is_recorrente BOOLEAN DEFAULT 0;
ALTER TABLE appointments ADD COLUMN frequencia VARCHAR(20);
ALTER TABLE appointments ADD COLUMN intervalo INTEGER DEFAULT 1;
ALTER TABLE appointments ADD COLUMN data_termino_recorrencia DATE;
ALTER TABLE appointments ADD COLUMN grupo_recorrencia VARCHAR(255);
ALTER TABLE appointments ADD COLUMN is_evento BOOLEAN DEFAULT 0;
ALTER TABLE appointments ADD COLUMN tipo_evento VARCHAR(50);
ALTER TABLE appointments ADD COLUMN cor VARCHAR(20);

-- Criar tabelas do Kanban
CREATE TABLE IF NOT EXISTS kanban_boards (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kanban_columns (
  id VARCHAR(255) PRIMARY KEY,
  board_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(20),
  position INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES kanban_boards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kanban_cards (
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
);
