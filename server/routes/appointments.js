const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('./auth');
const { addWeeks, addMonths, parseISO, isBefore } = require('date-fns');

const router = express.Router();

// Todas as rotas protegidas
router.use(authenticateToken);

// Listar todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const appointments = await req.db('appointments')
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .select(
        'appointments.*',
        'patients.name as patient_name',
        'patients.phone as patient_phone'
      )
      .orderBy('appointments.date_time', 'asc');

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ message: 'Erro ao listar agendamentos' });
  }
});

// Criar agendamento simples
router.post('/', async (req, res) => {
  try {
    const {
      patient_id,
      date_time,
      end_time,
      duration,
      tipo_sessao,
      valor,
      metodo_pagamento,
      status_pagamento,
      status,
      notes,
      is_evento,
      tipo_evento,
      cor,
    } = req.body;

    if (!date_time || !end_time) {
      return res.status(400).json({ message: 'Data/hora obrigatórias' });
    }

    // Eventos não precisam de paciente
    if (!is_evento && !patient_id) {
      return res.status(400).json({ message: 'Paciente obrigatório para consultas' });
    }

    const appointment = {
      id: uuidv4(),
      patient_id: patient_id || null,
      date_time,
      end_time,
      duration: duration || 60,
      tipo_sessao: tipo_sessao || null,
      valor: valor || null,
      metodo_pagamento: metodo_pagamento || null,
      status_pagamento: status_pagamento || 'pendente',
      status: status || 'agendado',
      notes: notes || null,
      is_evento: is_evento || false,
      tipo_evento: tipo_evento || null,
      cor: cor || null,
      is_recorrente: false,
    };

    await req.db('appointments').insert(appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro ao criar agendamento' });
  }
});

// Criar agendamento recorrente
router.post('/recorrente', async (req, res) => {
  try {
    const {
      patient_id,
      date_time,
      duration,
      tipo_sessao,
      valor,
      metodo_pagamento,
      status_pagamento,
      status,
      notes,
      frequencia,
      data_termino,
    } = req.body;

    if (!patient_id || !date_time || !frequencia || !data_termino) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const grupoRecorrencia = uuidv4();
    const appointments = [];
    
    let currentDate = parseISO(date_time);
    const endDate = parseISO(data_termino);
    const durationMinutes = duration || 60;

    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
      const currentEndTime = new Date(currentDate.getTime() + durationMinutes * 60000);

      const appointment = {
        id: uuidv4(),
        patient_id,
        date_time: currentDate.toISOString(),
        end_time: currentEndTime.toISOString(),
        duration: durationMinutes,
        tipo_sessao: tipo_sessao || null,
        valor: valor || null,
        metodo_pagamento: metodo_pagamento || null,
        status_pagamento: status_pagamento || 'pendente',
        status: status || 'agendado',
        notes: notes || null,
        is_recorrente: true,
        frequencia,
        grupo_recorrencia: grupoRecorrencia,
        data_termino_recorrencia: data_termino,
        is_evento: false,
      };

      appointments.push(appointment);

      if (frequencia === 'semanal') {
        currentDate = addWeeks(currentDate, 1);
      } else if (frequencia === 'quinzenal') {
        currentDate = addWeeks(currentDate, 2);
      } else if (frequencia === 'mensal') {
        currentDate = addMonths(currentDate, 1);
      }
    }

    await req.db('appointments').insert(appointments);
    res.status(201).json({
      message: `${appointments.length} agendamentos recorrentes criados`,
      count: appointments.length,
    });
  } catch (error) {
    console.error('Erro ao criar agendamentos recorrentes:', error);
    res.status(500).json({ message: 'Erro ao criar agendamentos recorrentes' });
  }
});

// Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    const {
      date_time,
      end_time,
      duration,
      tipo_sessao,
      valor,
      metodo_pagamento,
      status_pagamento,
      status,
      notes,
    } = req.body;

    const appointment = await req.db('appointments')
      .where({ id: req.params.id })
      .first();

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    const updated = {
      date_time: date_time || appointment.date_time,
      end_time: end_time || appointment.end_time,
      duration: duration !== undefined ? duration : appointment.duration,
      tipo_sessao: tipo_sessao !== undefined ? tipo_sessao : appointment.tipo_sessao,
      valor: valor !== undefined ? valor : appointment.valor,
      metodo_pagamento: metodo_pagamento !== undefined ? metodo_pagamento : appointment.metodo_pagamento,
      status_pagamento: status_pagamento !== undefined ? status_pagamento : appointment.status_pagamento,
      status: status || appointment.status,
      notes: notes !== undefined ? notes : appointment.notes,
    };

    await req.db('appointments').where({ id: req.params.id }).update(updated);
    res.json({ ...appointment, ...updated });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ message: 'Erro ao atualizar agendamento' });
  }
});

// Deletar agendamento
router.delete('/:id', async (req, res) => {
  try {
    await req.db('session_notes').where({ appointment_id: req.params.id }).delete();
    await req.db('appointments').where({ id: req.params.id }).delete();
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ message: 'Erro ao deletar agendamento' });
  }
});

module.exports = router;
