/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists(
    'evangelistic_experiences',
    (table) => {
      table.increments('evang_exp_id').primary()
      table.string('project', 250).notNullable()
      table.string('place', 250).notNullable()
      table.date('exp_begin_date').notNullable()
      table.date('exp_end_date').notNullable()
      table.integer('person_id').unsigned().notNullable()
      table.integer('evang_exp_type_id').unsigned().notNullable()
      table.boolean('evang_exp_approved')
      table.foreign('person_id').references('people.person_id')
      table
        .foreign('evang_exp_type_id')
        .references('evang_exp_types.evang_exp_type_id')

      table.timestamps(true, true)
    },
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('evangelistic_experiences')
}
