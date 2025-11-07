const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env]);

// GET /api/notifications - Listar notificações
router.get('/', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('notifications')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    if (filter === 'unread') {
      query = query.where({ is_read: false });
    } else if (filter === 'read') {
      query = query.where({ is_read: true });
    }

    const total = await query.clone().count('* as count').first();
    const notifications = await query.limit(limit).offset(offset);

    res.json({
      notifications,
      pagination: {
        total: total.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações' });
  }
});

// GET /api/notifications/unread-count - Contar não lidas
router.get('/unread-count', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token

    const { count } = await db('notifications')
      .where({ user_id: userId, is_read: false })
      .count('* as count')
      .first();

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    res.status(500).json({ message: 'Erro ao contar notificações' });
  }
});

// PUT /api/notifications/:id/read - Marcar como lida
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = 1; // TODO: Pegar do token

    await db('notifications')
      .where({ id, user_id: userId })
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      });

    const notification = await db('notifications')
      .where({ id })
      .first();

    res.json(notification);
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ message: 'Erro ao atualizar notificação' });
  }
});

// PUT /api/notifications/mark-all-read - Marcar todas como lidas
router.put('/mark-all-read', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token

    await db('notifications')
      .where({ user_id: userId, is_read: false })
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      });

    res.json({ message: 'Todas as notificações marcadas como lidas' });
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    res.status(500).json({ message: 'Erro ao atualizar notificações' });
  }
});

// DELETE /api/notifications/:id - Deletar notificação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = 1; // TODO: Pegar do token

    await db('notifications')
      .where({ id, user_id: userId })
      .delete();

    res.json({ message: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ message: 'Erro ao deletar notificação' });
  }
});

// POST /api/notifications - Criar notificação (uso interno)
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      title,
      message,
      type = 'info',
      priority = 'normal',
      related_id,
      related_type
    } = req.body;

    const notification = {
      user_id,
      title,
      message,
      type,
      priority,
      related_id,
      related_type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    const [id] = await db('notifications').insert(notification);
    const created = await db('notifications').where({ id }).first();

    res.status(201).json(created);
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ message: 'Erro ao criar notificação' });
  }
});

module.exports = router;
