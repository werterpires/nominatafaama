/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('course_id').primary()
    table.string('course_area', 250).notNullable()
    table.string('institution', 250).notNullable()
    table.date('begin_date').notNullable()
    table.date('conclusion_date')
    table.integer('person_id').unsigned().notNullable()
    table.boolean('course_approved')
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
  return knex.schema.dropTable('courses')
}
