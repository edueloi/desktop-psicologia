const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env]);

// GET /api/search - Busca global
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all', limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        patients: [],
        appointments: [],
        kanban: [],
        total: 0
      });
    }

    const searchTerm = `%${q.toLowerCase()}%`;
    const results = {
      patients: [],
      appointments: [],
      kanban: [],
      total: 0
    };

    // Buscar pacientes
    if (type === 'all' || type === 'patients') {
      results.patients = await db('patients')
        .where(function() {
          this.whereRaw('LOWER(name) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(email) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(phone) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(notes) LIKE ?', [searchTerm]);
        })
        .limit(limit)
        .select('*');
    }

    // Buscar consultas
    if (type === 'all' || type === 'appointments') {
      results.appointments = await db('appointments')
        .select(
          'appointments.*',
          'patients.name as patient_name'
        )
        .leftJoin('patients', 'appointments.patient_id', 'patients.id')
        .where(function() {
          this.whereRaw('LOWER(appointments.title) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(appointments.notes) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(patients.name) LIKE ?', [searchTerm]);
        })
        .limit(limit);
    }

    // Buscar cards do Kanban
    if (type === 'all' || type === 'kanban') {
      results.kanban = await db('kanban_cards')
        .where(function() {
          this.whereRaw('LOWER(title) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(description) LIKE ?', [searchTerm]);
        })
        .limit(limit)
        .select('*');
    }

    results.total = results.patients.length + results.appointments.length + results.kanban.length;

    res.json(results);
  } catch (error) {
    console.error('Erro ao realizar busca:', error);
    res.status(500).json({ message: 'Erro ao realizar busca' });
  }
});

// GET /api/search/patients - Busca específica de pacientes
router.get('/patients', async (req, res) => {
  try {
    const { q, status, limit = 20 } = req.query;

    let query = db('patients');

    if (q && q.trim().length >= 2) {
      const searchTerm = `%${q.toLowerCase()}%`;
      query = query.where(function() {
        this.whereRaw('LOWER(name) LIKE ?', [searchTerm])
          .orWhereRaw('LOWER(email) LIKE ?', [searchTerm])
          .orWhereRaw('LOWER(phone) LIKE ?', [searchTerm]);
      });
    }

    if (status && status !== 'all') {
      query = query.where({ status });
    }

    const patients = await query.limit(limit).select('*');

    res.json(patients);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).json({ message: 'Erro ao buscar pacientes' });
  }
});

// GET /api/search/appointments - Busca específica de consultas
router.get('/appointments', async (req, res) => {
  try {
    const { q, status, date, limit = 20 } = req.query;

    let query = db('appointments')
      .select(
        'appointments.*',
        'patients.name as patient_name',
        'patients.email as patient_email'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id');

    if (q && q.trim().length >= 2) {
      const searchTerm = `%${q.toLowerCase()}%`;
      query = query.where(function() {
        this.whereRaw('LOWER(appointments.title) LIKE ?', [searchTerm])
          .orWhereRaw('LOWER(appointments.notes) LIKE ?', [searchTerm])
          .orWhereRaw('LOWER(patients.name) LIKE ?', [searchTerm]);
      });
    }

    if (status && status !== 'all') {
      query = query.where('appointments.status', status);
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query = query.whereBetween('appointments.date', [
        startDate.toISOString(),
        endDate.toISOString()
      ]);
    }

    const appointments = await query.limit(limit);

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    res.status(500).json({ message: 'Erro ao buscar consultas' });
  }
});

// GET /api/search/suggestions - Sugestões de busca
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchTerm = `%${q.toLowerCase()}%`;
    const suggestions = [];

    // Nomes de pacientes
    const patients = await db('patients')
      .whereRaw('LOWER(name) LIKE ?', [searchTerm])
      .limit(5)
      .select('name');

    patients.forEach(p => {
      suggestions.push({
        text: p.name,
        type: 'patient',
        icon: 'person'
      });
    });

    // Títulos de consultas
    const appointments = await db('appointments')
      .whereRaw('LOWER(title) LIKE ?', [searchTerm])
      .limit(3)
      .select('title')
      .distinct();

    appointments.forEach(a => {
      if (a.title) {
        suggestions.push({
          text: a.title,
          type: 'appointment',
          icon: 'event'
        });
      }
    });

    res.json(suggestions.slice(0, 8));
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    res.status(500).json({ message: 'Erro ao buscar sugestões' });
  }
});

module.exports = router;
