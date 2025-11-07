const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const bcrypt = require('bcrypt');

// GET /api/profile - Buscar perfil do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await req.db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'phone', 'bio', 'avatar', 'specialty', 'crp', 'address', 'city', 'state', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

// PUT /api/profile - Atualizar perfil
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      bio,
      specialty,
      crp,
      address,
      city,
      state
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (specialty) updateData.specialty = specialty;
    if (crp) updateData.crp = crp;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;

    await req.db('users')
      .where({ id: userId })
      .update(updateData);

    const updated = await req.db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'phone', 'bio', 'avatar', 'specialty', 'crp', 'address', 'city', 'state')
      .first();

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// PUT /api/profile/password - Alterar senha
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar usuário
    const user = await req.db('users')
      .where({ id: userId })
      .select('id', 'password_hash')
      .first();

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await req.db('users')
      .where({ id: userId })
      .update({ password_hash: hashedPassword });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
});

// GET /api/profile/statistics - Estatísticas do perfil
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total de pacientes
    const totalPatients = await req.db('patients')
      .count('* as count')
      .first();

    // Total de consultas
    const totalAppointments = await req.db('appointments')
      .count('* as count')
      .first();

    // Consultas este mês
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthAppointments = await req.db('appointments')
      .where('date', '>=', firstDay.toISOString())
      .count('* as count')
      .first();

    // Taxa de comparecimento
    const completedAppointments = await req.db('appointments')
      .where('status', 'completed')
      .count('* as count')
      .first();

    const attendanceRate = totalAppointments.count > 0
      ? ((completedAppointments.count / totalAppointments.count) * 100).toFixed(1)
      : 0;

    res.json({
      totalPatients: totalPatients.count || 0,
      totalAppointments: totalAppointments.count || 0,
      thisMonthAppointments: thisMonthAppointments.count || 0,
      attendanceRate: parseFloat(attendanceRate)
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
