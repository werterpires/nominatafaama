/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('related_ministries', (table) => {
    table.increments('related_ministry_id').primary()

    table.integer('person_id').unsigned().notNullable()
    table.integer('ministry_type_id').unsigned().notNullable()
    table.integer('priority').notNullable()
    table.boolean('related_ministry_approved')

    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
    table
      .foreign('ministry_type_id')
      .references('ministry_types.ministry_type_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('related_ministries')
}
