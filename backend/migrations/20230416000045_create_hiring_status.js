/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('hiring_status', (table) => {
    table.increments('hiring_status_id').primary()
    table.string('hiring_status_name', 150).notNullable()
    table.string('hiring_status_description', 250).notNullable()
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable('hiring_status')
}
