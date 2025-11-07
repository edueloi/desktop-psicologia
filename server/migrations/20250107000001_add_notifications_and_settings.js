/**
 * Migration para criar tabelas de notificações e configurações
 */

exports.up = function(knex) {
  return Promise.all([
    // Tabela de notificações
    knex.schema.hasTable('notifications').then(exists => {
      if (!exists) {
        return knex.schema.createTable('notifications', table => {
          table.increments('id').primary();
          table.integer('user_id').notNullable();
          table.string('title').notNullable();
          table.text('message').notNullable();
          table.string('type').defaultTo('info'); // info, success, warning, error
          table.string('priority').defaultTo('normal'); // low, normal, high, urgent
          table.integer('related_id').nullable();
          table.string('related_type').nullable(); // patient, appointment, etc
          table.boolean('is_read').defaultTo(false);
          table.timestamp('read_at').nullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          
          table.index(['user_id', 'is_read']);
          table.index(['user_id', 'created_at']);
        });
      }
    }),

    // Tabela de configurações do usuário
    knex.schema.hasTable('user_settings').then(exists => {
      if (!exists) {
        return knex.schema.createTable('user_settings', table => {
          table.increments('id').primary();
          table.integer('user_id').notNullable().unique();
          
          // Configurações de consulta
          table.integer('appointment_duration').defaultTo(50); // minutos
          table.integer('appointment_interval').defaultTo(10); // minutos entre consultas
          table.string('work_start_time').defaultTo('08:00');
          table.string('work_end_time').defaultTo('18:00');
          table.json('work_days').defaultTo('[1,2,3,4,5]'); // Segunda a sexta
          
          // Configurações de notificação
          table.boolean('notification_email').defaultTo(true);
          table.boolean('notification_sms').defaultTo(false);
          table.boolean('notification_whatsapp').defaultTo(true);
          table.integer('reminder_hours_before').defaultTo(24);
          
          // Configurações gerais
          table.string('currency').defaultTo('BRL');
          table.string('timezone').defaultTo('America/Sao_Paulo');
          table.string('language').defaultTo('pt-BR');
          table.string('theme').defaultTo('light');
          
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          
          table.index('user_id');
        });
      }
    }),

    // Adicionar campos extras na tabela users se não existirem
    knex.schema.hasColumn('users', 'phone').then(exists => {
      if (!exists) {
        return knex.schema.table('users', table => {
          table.string('phone').nullable();
          table.text('bio').nullable();
          table.string('avatar').nullable();
          table.string('specialty').nullable(); // Especialidade
          table.string('crp').nullable(); // Registro CRP
          table.string('address').nullable();
          table.string('city').nullable();
          table.string('state').nullable();
        });
      }
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('notifications'),
    knex.schema.dropTableIfExists('user_settings'),
    knex.schema.hasTable('users').then(exists => {
      if (exists) {
        return knex.schema.table('users', table => {
          table.dropColumn('phone');
          table.dropColumn('bio');
          table.dropColumn('avatar');
          table.dropColumn('specialty');
          table.dropColumn('crp');
          table.dropColumn('address');
          table.dropColumn('city');
          table.dropColumn('state');
        });
      }
    })
  ]);
};
