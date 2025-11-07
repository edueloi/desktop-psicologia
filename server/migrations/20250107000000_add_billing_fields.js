exports.up = function (knex) {
  return knex.schema
    .table('appointments', function (table) {
      // Campos de faturamento
      table.decimal('valor', 10, 2).nullable(); // Valor da sessão
      table.string('tipo_sessao', 50).nullable(); // Psicoterapia, Avaliação, etc
      table.string('metodo_pagamento', 50).nullable(); // Dinheiro, PIX, Cartão
      table.string('status_pagamento', 20).defaultTo('pendente'); // pendente, pago, cancelado
      
      // Campos de recorrência
      table.boolean('is_recorrente').defaultTo(false);
      table.string('frequencia', 20).nullable(); // semanal, quinzenal, mensal
      table.integer('intervalo').defaultTo(1); // A cada quantas semanas/meses
      table.date('data_termino_recorrencia').nullable();
      table.string('grupo_recorrencia').nullable(); // UUID para agrupar recorrências
      
      // Campos para eventos (não-consultas)
      table.boolean('is_evento').defaultTo(false); // true para eventos gerais
      table.string('tipo_evento', 50).nullable(); // reunião, compromisso pessoal, etc
      table.string('cor', 20).nullable(); // Cor do evento no calendário
    });
};

exports.down = function (knex) {
  return knex.schema.table('appointments', function (table) {
    table.dropColumn('valor');
    table.dropColumn('tipo_sessao');
    table.dropColumn('metodo_pagamento');
    table.dropColumn('status_pagamento');
    table.dropColumn('is_recorrente');
    table.dropColumn('frequencia');
    table.dropColumn('intervalo');
    table.dropColumn('data_termino_recorrencia');
    table.dropColumn('grupo_recorrencia');
    table.dropColumn('is_evento');
    table.dropColumn('tipo_evento');
    table.dropColumn('cor');
  });
};
