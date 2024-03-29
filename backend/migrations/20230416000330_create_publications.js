/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('publications', (table) => {
    table.increments('publication_id').primary()
    table.integer('publication_type_id').unsigned().notNullable()
    table.string('reference', 500).notNullable()
    table.string('link', 500)
    table.boolean('publication_approved')
    table.integer('person_id').unsigned()

    table.foreign('person_id').references('people.person_id')

    table
      .foreign('publication_type_id')
      .references('publication_types.publication_type_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('publications')
}
