exports.up = function (knex) {
  return knex.schema.table('appointments', function (table) {
    // Renomear colunas antigas
    table.renameColumn('start_at', 'date_time');
    table.renameColumn('end_at', 'end_time');
    
    // Adicionar duration
    table.integer('duration').defaultTo(60); // em minutos
  });
};

exports.down = function (knex) {
  return knex.schema.table('appointments', function (table) {
    table.renameColumn('date_time', 'start_at');
    table.renameColumn('end_time', 'end_at');
    table.dropColumn('duration');
  });
};
