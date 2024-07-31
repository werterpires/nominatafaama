/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('endowments', (table) => {
    table.increments('endowment_id').primary()

    table.integer('person_id').unsigned().notNullable()
    table.integer('endowment_type_id').unsigned().notNullable()
    table.boolean('endowment_approved')
    table.foreign('person_id').references('people.person_id')
    table
      .foreign('endowment_type_id')
      .references('endowment_types.endowment_type_id')
    table.string('place', 250)
    table.string('year', 4)

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('endowments')
}
