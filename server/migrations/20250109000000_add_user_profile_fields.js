exports.up = async (knex) => {
  // Verificar se as colunas já existem antes de adicionar
  const hasPhone = await knex.schema.hasColumn('users', 'phone');
  const hasBio = await knex.schema.hasColumn('users', 'bio');
  const hasAvatar = await knex.schema.hasColumn('users', 'avatar');
  const hasSpecialty = await knex.schema.hasColumn('users', 'specialty');
  const hasCrp = await knex.schema.hasColumn('users', 'crp');
  const hasAddress = await knex.schema.hasColumn('users', 'address');
  const hasCity = await knex.schema.hasColumn('users', 'city');
  const hasState = await knex.schema.hasColumn('users', 'state');

  await knex.schema.alterTable('users', (t) => {
    if (!hasPhone) t.string('phone');
    if (!hasBio) t.text('bio');
    if (!hasAvatar) t.string('avatar');
    if (!hasSpecialty) t.string('specialty');
    if (!hasCrp) t.string('crp');
    if (!hasAddress) t.string('address');
    if (!hasCity) t.string('city');
    if (!hasState) t.string('state');
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumn('phone');
    t.dropColumn('bio');
    t.dropColumn('avatar');
    t.dropColumn('specialty');
    t.dropColumn('crp');
    t.dropColumn('address');
    t.dropColumn('city');
    t.dropColumn('state');
  });
};
