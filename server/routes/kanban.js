const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.use(authenticateToken);

// ====== COLUNAS ======

// Listar colunas
router.get('/columns', async (req, res) => {
  try {
    const columns = await req.db('kanban_columns')
      .select('*')
      .orderBy('position', 'asc');
    res.json(columns);
  } catch (error) {
    console.error('Erro ao listar colunas:', error);
    res.status(500).json({ message: 'Erro ao listar colunas' });
  }
});

// Criar coluna
router.post('/columns', async (req, res) => {
  try {
    const { title, color, position } = req.body;

    const column = {
      id: uuidv4(),
      board_id: 'default', // Por enquanto um board único
      title,
      color: color || '#1976d2',
      position: position || 0,
    };

    // Garantir que existe o board
    const boardExists = await req.db('kanban_boards').where({ id: 'default' }).first();
    if (!boardExists) {
      await req.db('kanban_boards').insert({
        id: 'default',
        title: 'Board Principal',
        description: 'Board padrão',
        position: 0,
      });
    }

    await req.db('kanban_columns').insert(column);
    res.status(201).json(column);
  } catch (error) {
    console.error('Erro ao criar coluna:', error);
    res.status(500).json({ message: 'Erro ao criar coluna' });
  }
});

// Atualizar coluna
router.put('/columns/:id', async (req, res) => {
  try {
    const { title, color, position } = req.body;
    
    await req.db('kanban_columns')
      .where({ id: req.params.id })
      .update({
        title: title !== undefined ? title : undefined,
        color: color !== undefined ? color : undefined,
        position: position !== undefined ? position : undefined,
      });

    const updated = await req.db('kanban_columns').where({ id: req.params.id }).first();
    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar coluna:', error);
    res.status(500).json({ message: 'Erro ao atualizar coluna' });
  }
});

// Deletar coluna
router.delete('/columns/:id', async (req, res) => {
  try {
    await req.db('kanban_columns').where({ id: req.params.id }).delete();
    res.json({ message: 'Coluna deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar coluna:', error);
    res.status(500).json({ message: 'Erro ao deletar coluna' });
  }
});

// ====== CARDS ======

// Listar cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await req.db('kanban_cards')
      .leftJoin('patients', 'kanban_cards.patient_id', 'patients.id')
      .leftJoin('appointments', 'kanban_cards.appointment_id', 'appointments.id')
      .select(
        'kanban_cards.*',
        'patients.name as patient_name',
        'appointments.date_time as appointment_date'
      )
      .orderBy('kanban_cards.position', 'asc');
    
    res.json(cards);
  } catch (error) {
    console.error('Erro ao listar cards:', error);
    res.status(500).json({ message: 'Erro ao listar cards' });
  }
});

// Criar card
router.post('/cards', async (req, res) => {
  try {
    const {
      column_id,
      title,
      description,
      patient_id,
      appointment_id,
      priority,
      due_date,
      position,
    } = req.body;

    const card = {
      id: uuidv4(),
      column_id,
      title,
      description: description || null,
      patient_id: patient_id || null,
      appointment_id: appointment_id || null,
      priority: priority || 'media',
      due_date: due_date || null,
      position: position || 0,
    };

    await req.db('kanban_cards').insert(card);
    res.status(201).json(card);
  } catch (error) {
    console.error('Erro ao criar card:', error);
    res.status(500).json({ message: 'Erro ao criar card' });
  }
});

// Atualizar card
router.put('/cards/:id', async (req, res) => {
  try {
    const {
      column_id,
      title,
      description,
      patient_id,
      appointment_id,
      priority,
      due_date,
      position,
    } = req.body;

    const updateData = {};
    if (column_id !== undefined) updateData.column_id = column_id;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (patient_id !== undefined) updateData.patient_id = patient_id;
    if (appointment_id !== undefined) updateData.appointment_id = appointment_id;
    if (priority !== undefined) updateData.priority = priority;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (position !== undefined) updateData.position = position;

    await req.db('kanban_cards')
      .where({ id: req.params.id })
      .update(updateData);

    const updated = await req.db('kanban_cards').where({ id: req.params.id }).first();
    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar card:', error);
    res.status(500).json({ message: 'Erro ao atualizar card' });
  }
});

// Deletar card
router.delete('/cards/:id', async (req, res) => {
  try {
    await req.db('kanban_cards').where({ id: req.params.id }).delete();
    res.json({ message: 'Card deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar card:', error);
    res.status(500).json({ message: 'Erro ao deletar card' });
  }
});

module.exports = router;
