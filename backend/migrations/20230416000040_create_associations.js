/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('associations', (table) => {
    table.increments('association_id').primary()
    table.string('association_name', 250).notNullable()
    table.string('association_acronym', 150).notNullable()
    table.integer('union_id').unsigned().notNullable()
    table.foreign('union_id').references('unions.union_id')
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable('associations')
}
