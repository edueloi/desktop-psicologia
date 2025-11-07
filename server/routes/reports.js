const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env]);

// GET /api/reports/sessions - Relatório de sessões
router.get('/sessions', async (req, res) => {
  try {
    const { startDate, endDate, patientId } = req.query;

    let query = db('appointments')
      .select(
        'appointments.*',
        'patients.name as patient_name',
        'patients.email as patient_email',
        'patients.phone as patient_phone'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .where('appointments.status', 'completed')
      .orderBy('appointments.date', 'desc');

    if (startDate) {
      query = query.where('appointments.date', '>=', new Date(startDate).toISOString());
    }

    if (endDate) {
      query = query.where('appointments.date', '<=', new Date(endDate).toISOString());
    }

    if (patientId) {
      query = query.where('appointments.patient_id', patientId);
    }

    const sessions = await query;

    // Estatísticas
    const totalSessions = sessions.length;
    const totalRevenue = sessions.reduce((sum, s) => sum + (s.price || 0), 0);
    const paidSessions = sessions.filter(s => s.payment_status === 'paid').length;
    const pendingSessions = sessions.filter(s => s.payment_status === 'pending').length;

    res.json({
      sessions,
      statistics: {
        total: totalSessions,
        revenue: totalRevenue,
        paid: paidSessions,
        pending: pendingSessions,
        averagePrice: totalSessions > 0 ? (totalRevenue / totalSessions).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de sessões:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório de sessões' });
  }
});

// GET /api/reports/patients - Relatório de pacientes
router.get('/patients', async (req, res) => {
  try {
    const { status } = req.query;

    let query = db('patients')
      .select('patients.*')
      .orderBy('patients.created_at', 'desc');

    if (status && status !== 'all') {
      query = query.where('patients.status', status);
    }

    const patients = await query;

    // Buscar estatísticas de cada paciente
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointments = await db('appointments')
          .where('patient_id', patient.id)
          .select('*');

        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.status === 'completed').length;
        const totalPaid = appointments
          .filter(a => a.payment_status === 'paid')
          .reduce((sum, a) => sum + (a.price || 0), 0);
        const totalPending = appointments
          .filter(a => a.payment_status === 'pending')
          .reduce((sum, a) => sum + (a.price || 0), 0);

        const lastAppointment = appointments.length > 0
          ? appointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
          : null;

        return {
          ...patient,
          statistics: {
            totalAppointments,
            completedAppointments,
            totalPaid,
            totalPending,
            lastAppointment
          }
        };
      })
    );

    res.json({
      patients: patientsWithStats,
      summary: {
        total: patients.length,
        active: patients.filter(p => p.status === 'active').length,
        inactive: patients.filter(p => p.status === 'inactive').length
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de pacientes:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório de pacientes' });
  }
});

// GET /api/reports/financial - Relatório financeiro
router.get('/financial', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const appointments = await db('appointments')
      .whereBetween('date', [start.toISOString(), end.toISOString()])
      .select('*');

    // Agrupar por período
    const grouped = {};
    
    appointments.forEach(apt => {
      const date = new Date(apt.date);
      let key;

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const week = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-W${week}`;
      } else {
        key = date.toISOString().split('T')[0];
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          total: 0,
          received: 0,
          pending: 0,
          cancelled: 0,
          appointments: 0
        };
      }

      grouped[key].appointments += 1;
      grouped[key].total += apt.price || 0;

      if (apt.payment_status === 'paid') {
        grouped[key].received += apt.price || 0;
      } else if (apt.payment_status === 'pending') {
        grouped[key].pending += apt.price || 0;
      }

      if (apt.status === 'cancelled') {
        grouped[key].cancelled += 1;
      }
    });

    const data = Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));

    // Totais gerais
    const totals = {
      revenue: data.reduce((sum, d) => sum + d.total, 0),
      received: data.reduce((sum, d) => sum + d.received, 0),
      pending: data.reduce((sum, d) => sum + d.pending, 0),
      appointments: data.reduce((sum, d) => sum + d.appointments, 0),
      cancelled: data.reduce((sum, d) => sum + d.cancelled, 0)
    };

    res.json({
      data,
      totals,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        groupBy
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório financeiro' });
  }
});

// GET /api/reports/statistics - Estatísticas gerais
router.get('/statistics', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Pacientes ativos
    const activePatients = await db('patients')
      .where('status', 'active')
      .count('* as count')
      .first();

    // Consultas este mês
    const thisMonthAppointments = await db('appointments')
      .where('date', '>=', currentMonth.toISOString())
      .count('* as count')
      .first();

    // Consultas mês passado
    const lastMonthAppointments = await db('appointments')
      .whereBetween('date', [lastMonth.toISOString(), lastMonthEnd.toISOString()])
      .count('* as count')
      .first();

    // Receita este mês
    const thisMonthRevenue = await db('appointments')
      .where('date', '>=', currentMonth.toISOString())
      .where('payment_status', 'paid')
      .sum('price as total')
      .first();

    // Taxa de comparecimento
    const completedAppointments = await db('appointments')
      .where('date', '>=', currentMonth.toISOString())
      .where('status', 'completed')
      .count('* as count')
      .first();

    const attendanceRate = thisMonthAppointments.count > 0
      ? ((completedAppointments.count / thisMonthAppointments.count) * 100).toFixed(1)
      : 0;

    res.json({
      activePatients: activePatients.count || 0,
      thisMonthAppointments: thisMonthAppointments.count || 0,
      lastMonthAppointments: lastMonthAppointments.count || 0,
      thisMonthRevenue: thisMonthRevenue.total || 0,
      attendanceRate: parseFloat(attendanceRate),
      appointmentsGrowth: lastMonthAppointments.count > 0
        ? (((thisMonthAppointments.count - lastMonthAppointments.count) / lastMonthAppointments.count) * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
