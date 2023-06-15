/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists('roles', (table) => {
    table.increments('role_id').primary()
    table.string('role_name', 150).notNullable()
    table.string('role_description', 255).notNullable()
    table.timestamps(true, true)
  })

  const roles = [
    {
      role_name: 'estudante',
      role_description: 'Usuário com poderes para cadastrar informações.',
    },
    {
      role_name: 'docente',
      role_description:
        'Usuário com poderes de aprovar atividades dos estudantes.',
    },
    {
      role_name: 'secretaria',
      role_description:
        'Usuário com poder de aprovar estudantes e docentes e de criar e aprovar dados cadastrais.',
    },
    {
      role_name: 'direção',
      role_description:
        'Usuário com poder de aprovar usuários estudantes, docentes, secretarias e representantes de campo.',
    },
    {
      role_name: 'representantes de campo',
      role_description:
        'Usuário com poder de avaliar teologandos, criar vagas e realizar chamados.',
    },
    {
      role_name: 'administrador',
      role_description: 'Usuário com todos os poderes do sistema.',
    },
  ]

  await knex('roles').insert(roles)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('roles')
}
