/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('ministry_types', (table) => {
    table.increments('ministry_type_id').primary()

    table.string('ministry_type_name', 150).notNullable()
    table.boolean('ministry_type_approved').notNullable()

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('ministry_types')
}
