/**
 * Migration para adicionar suporte a múltiplos boards no Kanban
 */

exports.up = async function(knex) {
  // Verificar se a tabela já existe antes de criar
  const boardsExists = await knex.schema.hasTable('kanban_boards');
  
  if (!boardsExists) {
    await knex.schema.createTable('kanban_boards', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('name').notNullable();
      table.text('description');
      table.string('color').defaultTo('#2BC7D4');
      table.boolean('favorite').defaultTo(false);
      table.timestamps(true, true);
      
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.index('user_id');
      table.index('favorite');
    });
  }
  
  // Verificar se a coluna board_id já existe em kanban_columns
  const hasColumn = await knex.schema.hasColumn('kanban_columns', 'board_id');
  
  if (!hasColumn) {
    await knex.schema.table('kanban_columns', (table) => {
      table.integer('board_id').unsigned();
      table.foreign('board_id').references('kanban_boards.id').onDelete('CASCADE');
      table.index('board_id');
    });
    
    // Inserir board padrão e migrar dados apenas se a coluna foi adicionada
    const columnsExist = await knex('kanban_columns').select('id').limit(1);
    if (columnsExist.length > 0) {
      await knex.raw(`
        INSERT INTO kanban_boards (user_id, name, description, color, favorite)
        SELECT DISTINCT 
          1 as user_id,
          'Meu Quadro Principal' as name,
          'Quadro criado automaticamente' as description,
          '#2BC7D4' as color,
          1 as favorite
        FROM kanban_columns
        WHERE board_id IS NULL
        LIMIT 1
      `);
      
      await knex.raw(`
        UPDATE kanban_columns 
        SET board_id = (SELECT id FROM kanban_boards ORDER BY id LIMIT 1)
        WHERE board_id IS NULL
      `);
    }
  }
};

exports.down = function(knex) {
  return knex.schema
    .table('kanban_columns', (table) => {
      table.dropForeign('board_id');
      table.dropColumn('board_id');
    })
    .dropTable('kanban_boards');
};
