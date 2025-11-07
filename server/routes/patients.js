const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Todas as rotas protegidas
router.use(authenticateToken);

// Listar todos os pacientes
router.get('/', async (req, res) => {
  try {
    const patients = await req.db('patients').orderBy('name', 'asc');
    res.json(patients);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ message: 'Erro ao listar pacientes' });
  }
});

// Buscar paciente por ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await req.db('patients').where({ id: req.params.id }).first();
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ message: 'Erro ao buscar paciente' });
  }
});

// Criar novo paciente
router.post('/', async (req, res) => {
  try {
    const { name, birth_date, cpf, phone, email, address_json, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    // Verificar se CPF já existe (se fornecido)
    if (cpf) {
      const existing = await req.db('patients').where({ cpf }).first();
      if (existing) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }
    }

    const patient = {
      id: uuidv4(),
      name,
      birth_date: birth_date || null,
      cpf: cpf || null,
      phone: phone || null,
      email: email || null,
      address_json: address_json || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await req.db('patients').insert(patient);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ message: 'Erro ao criar paciente' });
  }
});

// Atualizar paciente
router.put('/:id', async (req, res) => {
  try {
    const { name, birth_date, cpf, phone, email, address_json, notes } = req.body;

    const patient = await req.db('patients').where({ id: req.params.id }).first();

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    // Verificar se CPF já existe em outro paciente
    if (cpf && cpf !== patient.cpf) {
      const existing = await req.db('patients')
        .where({ cpf })
        .whereNot({ id: req.params.id })
        .first();
      
      if (existing) {
        return res.status(400).json({ message: 'CPF já cadastrado para outro paciente' });
      }
    }

    const updated = {
      name: name || patient.name,
      birth_date: birth_date !== undefined ? birth_date : patient.birth_date,
      cpf: cpf !== undefined ? cpf : patient.cpf,
      phone: phone !== undefined ? phone : patient.phone,
      email: email !== undefined ? email : patient.email,
      address_json: address_json !== undefined ? address_json : patient.address_json,
      notes: notes !== undefined ? notes : patient.notes,
      updated_at: new Date().toISOString(),
    };

    await req.db('patients').where({ id: req.params.id }).update(updated);
    res.json({ ...patient, ...updated });
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ message: 'Erro ao atualizar paciente' });
  }
});

// Deletar paciente
router.delete('/:id', async (req, res) => {
  try {
    const patient = await req.db('patients').where({ id: req.params.id }).first();

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    // Deletar registros relacionados primeiro
    await req.db('files').where({ patient_id: req.params.id }).delete();
    await req.db('session_notes')
      .whereIn('appointment_id', function() {
        this.select('id').from('appointments').where({ patient_id: req.params.id });
      })
      .delete();
    await req.db('appointments').where({ patient_id: req.params.id }).delete();
    await req.db('patients').where({ id: req.params.id }).delete();

    res.json({ message: 'Paciente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ message: 'Erro ao deletar paciente' });
  }
});

module.exports = router;
