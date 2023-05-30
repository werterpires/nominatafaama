/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('past_ecl_exps', (table) => {
    table.increments('past_ecl_id').primary()

    table.string('function', 250).notNullable()
    table.string('place', 250).notNullable()
    table.date('past_exp_begin_date').notNullable()
    table.date('past_exp_end_date').notNullable()
    table.integer('person_id').unsigned().notNullable()
    table.boolean('past_ecl_approved')
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
  return knex.schema.dropTable('past_ecl_exps')
}
