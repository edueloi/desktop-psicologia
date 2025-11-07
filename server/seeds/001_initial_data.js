const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function (knex) {
  // Limpar tabelas existentes
  await knex('files').del();
  await knex('session_notes').del();
  await knex('appointments').del();
  await knex('patients').del();
  await knex('users').del();

  // Criar usuário admin padrão
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await knex('users').insert([
    {
      id: uuidv4(),
      name: 'Administrador',
      email: 'admin@psychdesk.com',
      password_hash: passwordHash,
      role: 'admin',
      created_at: new Date().toISOString(),
    },
  ]);

  console.log('✓ Usuário admin criado: admin@psychdesk.com / admin123');

  // Criar alguns pacientes de exemplo (opcional)
  const patients = [
    {
      id: uuidv4(),
      name: 'Maria Silva',
      birth_date: '1990-05-15',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
      address_json: JSON.stringify({
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-567',
      }),
      notes: 'Paciente exemplo para demonstração',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'João Santos',
      birth_date: '1985-08-20',
      phone: '(11) 91234-5678',
      email: 'joao.santos@email.com',
      address_json: JSON.stringify({
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01310-100',
      }),
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  await knex('patients').insert(patients);
  console.log('✓ Pacientes de exemplo criados');
};
