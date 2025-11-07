const express = require('express');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Todas as rotas protegidas
router.use(authenticateToken);

// Estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    // Total de pacientes
    const totalPatientsResult = await req.db('patients').count('* as count').first();
    const totalPatients = totalPatientsResult.count || 0;

    // Sessões hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessionsTodayResult = await req.db('appointments')
      .where('date_time', '>=', today.toISOString())
      .where('date_time', '<', tomorrow.toISOString())
      .where('status', '!=', 'cancelled')
      .count('* as count')
      .first();
    const sessionsToday = sessionsTodayResult.count || 0;

    // Faltas este mês
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const missedAppointmentsResult = await req.db('appointments')
      .where('date_time', '>=', firstDayOfMonth.toISOString())
      .where('status', 'missed')
      .count('* as count')
      .first();
    const missedAppointments = missedAppointmentsResult.count || 0;

    // Aniversários próximos (próximos 30 dias)
    const upcomingBirthdaysResult = await req.db('patients')
      .whereNotNull('birth_date')
      .select('birth_date');
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    let upcomingBirthdays = 0;
    upcomingBirthdaysResult.forEach((patient) => {
      if (patient.birth_date) {
        const birthDate = new Date(patient.birth_date);
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );
        
        if (thisYearBirthday >= today && thisYearBirthday <= thirtyDaysFromNow) {
          upcomingBirthdays++;
        }
      }
    });

    res.json({
      totalPatients,
      sessionsToday,
      missedAppointments,
      upcomingBirthdays,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
