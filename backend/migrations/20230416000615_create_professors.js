/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('professors', (table) => {
    table.increments('professor_id').primary()
    table.integer('person_id').notNullable().unsigned().unique()
    table.string('assignments', 500).notNullable()
    table.string('professor_photo_address', 700)
    table.boolean('approved').notNullable()

    table.foreign('person_id').references('people.person_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('professors')
}
