exports.up = async (knex) => {
  // Tabela de usuários
  await knex.schema.createTable('users', (t) => {
    t.string('id').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.string('role').notNullable().defaultTo('admin');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Tabela de pacientes
  await knex.schema.createTable('patients', (t) => {
    t.string('id').primary();
    t.string('name').notNullable();
    t.date('birth_date');
    t.string('cpf').unique();
    t.string('phone');
    t.string('email');
    t.text('address_json');
    t.text('notes');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Tabela de agendamentos
  await knex.schema.createTable('appointments', (t) => {
    t.string('id').primary();
    t.string('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
    t.datetime('start_at').notNullable();
    t.datetime('end_at').notNullable();
    t.string('status').notNullable().defaultTo('scheduled'); // scheduled, completed, cancelled, missed
    t.text('notes');
  });

  // Tabela de notas de sessão
  await knex.schema.createTable('session_notes', (t) => {
    t.string('id').primary();
    t.string('appointment_id').notNullable().unique().references('id').inTable('appointments').onDelete('CASCADE');
    t.text('content').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Tabela de arquivos
  await knex.schema.createTable('files', (t) => {
    t.string('id').primary();
    t.string('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
    t.string('file_name').notNullable();
    t.string('mime_type').notNullable();
    t.integer('size').notNullable();
    t.string('stored_path').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('files');
  await knex.schema.dropTableIfExists('session_notes');
  await knex.schema.dropTableIfExists('appointments');
  await knex.schema.dropTableIfExists('patients');
  await knex.schema.dropTableIfExists('users');
};
