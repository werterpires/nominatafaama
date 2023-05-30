/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('marital_status_types', (table) => {
    table.increments('marital_status_type_id').primary()

    table.string('marital_status_type_name', 150).notNullable()

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('marital_status_types')
}
