/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('ordinations', (table) => {
    table.increments('ordination_id').primary()

    table.string('ordination_name', 250).notNullable()
    table.string('place', 250).notNullable()
    table.integer('year').notNullable()
    table.integer('person_id').unsigned().notNullable()
    table.boolean('ordination_approved')
    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('ordinations')
}
