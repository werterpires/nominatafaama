/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists(
    'professional_experiences',
    (table) => {
      table.increments('experience_id').primary()

      table.string('job', 250).notNullable()
      table.string('job_institution', 250).notNullable()
      table.date('job_begin_date').notNullable()
      table.date('job_end_date')
      table.integer('person_id').unsigned().notNullable()
      table.boolean('experience_approved')
      table
        .foreign('person_id')
        .references('people.person_id')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.timestamps(true, true)
    },
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('professional_experiences')
}
