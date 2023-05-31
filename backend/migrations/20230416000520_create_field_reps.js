/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('field_reps', (table) => {
    table.increments('rep_id').primary()
    table.string('phone_number', 15).notNullable()
    table.integer('person_id').unsigned().notNullable()

    table.foreign('person_id').references('people.person_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('field_reps')
}
