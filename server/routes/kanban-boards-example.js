// Rotas para múltiplos Boards Kanban
// Adicione estas rotas em server/routes/kanban.js

const express = require('express');
const router = express.Router();

// ==================== BOARDS ====================

// Listar todos os boards do usuário
router.get('/boards', async (req, res) => {
  try {
    const userId = req.user.id; // Assumindo autenticação
    const boards = await req.db('kanban_boards')
      .where({ user_id: userId })
      .orderBy('favorite', 'desc')
      .orderBy('created_at', 'desc');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar novo board
router.post('/boards', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, color } = req.body;
    
    const [id] = await req.db('kanban_boards').insert({
      user_id: userId,
      name,
      description,
      color,
      favorite: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    const board = await req.db('kanban_boards').where({ id }).first();
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar board
router.put('/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    await req.db('kanban_boards')
      .where({ id })
      .update({
        name,
        description,
        color,
        updated_at: new Date(),
      });
    
    const board = await req.db('kanban_boards').where({ id }).first();
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle favorito
router.put('/boards/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    
    const board = await req.db('kanban_boards').where({ id }).first();
    await req.db('kanban_boards')
      .where({ id })
      .update({
        favorite: !board.favorite,
        updated_at: new Date(),
      });
    
    const updatedBoard = await req.db('kanban_boards').where({ id }).first();
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir board
router.delete('/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Excluir cards das colunas do board
    const columns = await req.db('kanban_columns').where({ board_id: id });
    const columnIds = columns.map(c => c.id);
    
    if (columnIds.length > 0) {
      await req.db('kanban_cards').whereIn('column_id', columnIds).del();
    }
    
    // Excluir colunas
    await req.db('kanban_columns').where({ board_id: id }).del();
    
    // Excluir board
    await req.db('kanban_boards').where({ id }).del();
    
    res.json({ message: 'Board excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLUNAS (atualizar para filtrar por board) ====================

// Listar colunas de um board
router.get('/columns', async (req, res) => {
  try {
    const { board_id } = req.query;
    const columns = await req.db('kanban_columns')
      .where({ board_id })
      .orderBy('position');
    res.json(columns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CARDS (atualizar para filtrar por board) ====================

// Listar cards de um board
router.get('/cards', async (req, res) => {
  try {
    const { board_id } = req.query;
    
    // Buscar colunas do board
    const columns = await req.db('kanban_columns').where({ board_id });
    const columnIds = columns.map(c => c.id);
    
    // Buscar cards das colunas
    const cards = columnIds.length > 0
      ? await req.db('kanban_cards').whereIn('column_id', columnIds).orderBy('position')
      : [];
    
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
