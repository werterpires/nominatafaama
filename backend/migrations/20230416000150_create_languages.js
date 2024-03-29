/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('languages', (table) => {
    table.increments('language_id').primary()
    table.integer('chosen_language').unsigned().notNullable()
    table.boolean('read').notNullable()
    table.boolean('understand').notNullable()
    table.boolean('speak').notNullable()
    table.boolean('write').notNullable()
    table.boolean('fluent').notNullable()
    table.boolean('unknown').notNullable()
    table.integer('person_id').unsigned().notNullable()
    table.boolean('language_approved')

    table.foreign('person_id').references('people.person_id')

    table.foreign('chosen_language').references('language_types.language_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('languages')
}
