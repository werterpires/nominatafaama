/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('academic_formations', (table) => {
    table.increments('formation_id').primary()
    table.integer('degree_id').unsigned().notNullable()
    table.string('course_area', 250).notNullable()
    table.string('institution', 250).notNullable()
    table.date('begin_date').notNullable()
    table.date('conclusion_date')
    table.integer('person_id').unsigned().notNullable()
    table.boolean('academic_formation_approved').notNullable()

    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
    table
      .foreign('degree_id')
      .references('academic_degrees.degree_id')
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
  return knex.schema.dropTable('academic_formations')
}
