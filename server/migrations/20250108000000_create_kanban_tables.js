exports.up = function (knex) {
  return knex.schema
    .createTable('kanban_boards', (t) => {
      t.string('id').primary();
      t.string('title').notNullable();
      t.text('description');
      t.integer('position').defaultTo(0);
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('kanban_columns', (t) => {
      t.string('id').primary();
      t.string('board_id').notNullable().references('id').inTable('kanban_boards').onDelete('CASCADE');
      t.string('title').notNullable();
      t.string('color', 20).defaultTo('#1976d2');
      t.integer('position').defaultTo(0);
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('kanban_cards', (t) => {
      t.string('id').primary();
      t.string('column_id').notNullable().references('id').inTable('kanban_columns').onDelete('CASCADE');
      t.string('title').notNullable();
      t.text('description');
      t.string('patient_id').nullable().references('id').inTable('patients').onDelete('SET NULL');
      t.string('appointment_id').nullable().references('id').inTable('appointments').onDelete('SET NULL');
      t.string('priority', 20).defaultTo('media'); // baixa, media, alta
      t.date('due_date').nullable();
      t.integer('position').defaultTo(0);
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('kanban_cards')
    .dropTableIfExists('kanban_columns')
    .dropTableIfExists('kanban_boards');
};
