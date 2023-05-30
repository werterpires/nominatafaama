/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('evang_exp_types', (table) => {
    table.increments('evang_exp_type_id').primary()

    table.string('evang_exp_type_name', 150).notNullable()

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('evang_exp_types')
}
