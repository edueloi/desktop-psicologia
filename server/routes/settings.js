const express = require('express');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Todas as rotas protegidas
router.use(authenticateToken);

// GET /api/settings - Buscar configurações
router.get('/', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token

    // Buscar configurações do usuário
    const settings = await req.db('user_settings')
      .where({ user_id: userId })
      .first();

    if (!settings) {
      // Criar configurações padrão
      const defaultSettings = {
        user_id: userId,
        appointment_duration: 50,
        appointment_interval: 10,
        work_start_time: '08:00',
        work_end_time: '18:00',
        work_days: JSON.stringify([1, 2, 3, 4, 5]), // Segunda a sexta
        notification_email: true,
        notification_sms: false,
        notification_whatsapp: true,
        reminder_hours_before: 24,
        currency: 'BRL',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        theme: 'light',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await req.db('user_settings').insert(defaultSettings);
      return res.json(defaultSettings);
    }

    // Parse JSON fields
    if (typeof settings.work_days === 'string') {
      settings.work_days = JSON.parse(settings.work_days);
    }

    res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
});

// PUT /api/settings - Atualizar configurações
router.put('/', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token
    const {
      appointment_duration,
      appointment_interval,
      work_start_time,
      work_end_time,
      work_days,
      notification_email,
      notification_sms,
      notification_whatsapp,
      reminder_hours_before,
      currency,
      timezone,
      language,
      theme
    } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    
    if (appointment_duration !== undefined) updateData.appointment_duration = appointment_duration;
    if (appointment_interval !== undefined) updateData.appointment_interval = appointment_interval;
    if (work_start_time) updateData.work_start_time = work_start_time;
    if (work_end_time) updateData.work_end_time = work_end_time;
    if (work_days) updateData.work_days = JSON.stringify(work_days);
    if (notification_email !== undefined) updateData.notification_email = notification_email;
    if (notification_sms !== undefined) updateData.notification_sms = notification_sms;
    if (notification_whatsapp !== undefined) updateData.notification_whatsapp = notification_whatsapp;
    if (reminder_hours_before !== undefined) updateData.reminder_hours_before = reminder_hours_before;
    if (currency) updateData.currency = currency;
    if (timezone) updateData.timezone = timezone;
    if (language) updateData.language = language;
    if (theme) updateData.theme = theme;

    // Verificar se já existe
    const existing = await req.db('user_settings')
      .where({ user_id: userId })
      .first();

    if (existing) {
      await req.db('user_settings')
        .where({ user_id: userId })
        .update(updateData);
    } else {
      updateData.user_id = userId;
      updateData.created_at = new Date().toISOString();
      await req.db('user_settings').insert(updateData);
    }

    const updated = await req.db('user_settings')
      .where({ user_id: userId })
      .first();

    // Parse JSON
    if (typeof updated.work_days === 'string') {
      updated.work_days = JSON.parse(updated.work_days);
    }

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
});

// GET /api/settings/backup - Gerar backup dos dados
router.get('/backup', async (req, res) => {
  try {
    const userId = 1; // TODO: Pegar do token

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        patients: await db('patients').select('*'),
        appointments: await db('appointments').select('*'),
        kanban_cards: await db('kanban_cards').select('*'),
        settings: await db('user_settings').where({ user_id: userId }).first()
      }
    };

    res.json(backup);
  } catch (error) {
    console.error('Erro ao gerar backup:', error);
    res.status(500).json({ message: 'Erro ao gerar backup' });
  }
});

module.exports = router;
