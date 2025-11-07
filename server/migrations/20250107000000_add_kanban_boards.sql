-- Migration para criar tabela de Boards do Kanban
-- Execute este SQL no seu banco de dados

-- Tabela de Boards
CREATE TABLE IF NOT EXISTS kanban_boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#2BC7D4',
  favorite INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adicionar board_id na tabela de colunas
ALTER TABLE kanban_columns ADD COLUMN board_id INTEGER;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_kanban_boards_user ON kanban_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_boards_favorite ON kanban_boards(favorite);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_board ON kanban_columns(board_id);

-- Migrar dados existentes para um board padrão
-- (Execute isso se você já tem colunas e cards)
INSERT INTO kanban_boards (user_id, name, description, color, favorite)
SELECT DISTINCT 
  1 as user_id,  -- Ajuste para o ID do seu usuário
  'Meu Quadro Principal' as name,
  'Quadro criado automaticamente na migração' as description,
  '#2BC7D4' as color,
  1 as favorite
FROM kanban_columns
WHERE board_id IS NULL
LIMIT 1;

-- Atualizar colunas existentes para o novo board
UPDATE kanban_columns 
SET board_id = (SELECT id FROM kanban_boards ORDER BY id LIMIT 1)
WHERE board_id IS NULL;

-- Inserir alguns boards de exemplo (opcional)
INSERT INTO kanban_boards (user_id, name, description, color, favorite) VALUES
  (1, 'Atendimentos', 'Gestão de pacientes e consultas', '#2BC7D4', 1),
  (1, 'Projetos', 'Projetos de pesquisa e desenvolvimento', '#8B5CF6', 0),
  (1, 'Tarefas Pessoais', 'Organização pessoal', '#F59E0B', 0);
