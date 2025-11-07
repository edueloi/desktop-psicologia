const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env]);

// GET /api/billing/summary - Resumo financeiro
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

    // Data inicial e final do mês
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    // Total recebido no mês
    const received = await db('appointments')
      .where('payment_status', 'paid')
      .whereBetween('date', [startDate.toISOString(), endDate.toISOString()])
      .sum('price as total')
      .first();

    // Total pendente no mês
    const pending = await db('appointments')
      .where('payment_status', 'pending')
      .whereBetween('date', [startDate.toISOString(), endDate.toISOString()])
      .sum('price as total')
      .first();

    // Total de consultas no mês
    const totalAppointments = await db('appointments')
      .whereBetween('date', [startDate.toISOString(), endDate.toISOString()])
      .count('* as count')
      .first();

    // Taxa de recebimento
    const totalBilled = (received.total || 0) + (pending.total || 0);
    const receiptRate = totalBilled > 0 ? ((received.total || 0) / totalBilled * 100).toFixed(1) : 0;

    res.json({
      totalReceived: received.total || 0,
      totalPending: pending.total || 0,
      totalAppointments: totalAppointments.count || 0,
      receiptRate: parseFloat(receiptRate),
      month: selectedMonth,
      year: selectedYear
    });
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    res.status(500).json({ message: 'Erro ao buscar resumo financeiro' });
  }
});

// GET /api/billing/transactions - Listar transações
router.get('/transactions', async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('appointments')
      .select(
        'appointments.*',
        'patients.name as patient_name',
        'patients.email as patient_email'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .orderBy('appointments.date', 'desc');

    // Filtrar por mês/ano
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query = query.whereBetween('appointments.date', [startDate.toISOString(), endDate.toISOString()]);
    }

    // Filtrar por status de pagamento
    if (status && status !== 'all') {
      query = query.where('appointments.payment_status', status);
    }

    // Contagem total
    const countQuery = query.clone();
    const { count } = await countQuery.count('* as count').first();

    // Buscar dados paginados
    const transactions = await query.limit(limit).offset(offset);

    res.json({
      transactions,
      pagination: {
        total: parseInt(count),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro ao buscar transações' });
  }
});

// PUT /api/billing/transactions/:id - Atualizar status de pagamento
router.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method, payment_date } = req.body;

    const updateData = {};
    if (payment_status) updateData.payment_status = payment_status;
    if (payment_method) updateData.payment_method = payment_method;
    if (payment_date) updateData.payment_date = payment_date;

    await db('appointments')
      .where({ id })
      .update(updateData);

    const updated = await db('appointments')
      .select(
        'appointments.*',
        'patients.name as patient_name'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .where('appointments.id', id)
      .first();

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ message: 'Erro ao atualizar transação' });
  }
});

// GET /api/billing/chart-data - Dados para gráfico
router.get('/chart-data', async (req, res) => {
  try {
    const { year } = req.query;
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(selectedYear, month - 1, 1);
      const endDate = new Date(selectedYear, month, 0);

      const received = await db('appointments')
        .where('payment_status', 'paid')
        .whereBetween('date', [startDate.toISOString(), endDate.toISOString()])
        .sum('price as total')
        .first();

      const pending = await db('appointments')
        .where('payment_status', 'pending')
        .whereBetween('date', [startDate.toISOString(), endDate.toISOString()])
        .sum('price as total')
        .first();

      monthlyData.push({
        month,
        monthName: startDate.toLocaleString('pt-BR', { month: 'short' }),
        received: received.total || 0,
        pending: pending.total || 0,
        total: (received.total || 0) + (pending.total || 0)
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do gráfico' });
  }
});

module.exports = router;
