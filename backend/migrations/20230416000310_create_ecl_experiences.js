/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('ecl_experiences', (table) => {
    table.increments('ecl_exp_id').primary()
    table.integer('person_id').unsigned().notNullable()
    table.integer('ecl_exp_type_id').unsigned().notNullable()
    table.boolean('ecl_exp_approved')
    table.foreign('person_id').references('people.person_id')
    table.foreign('ecl_exp_type_id').references('ecl_exp_types.ecl_exp_type_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('ecl_experiences')
}
