/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('professional_experiences', (table) => {
    table.increments('experience_id').primary();
    
    table.string('job', 150);
    table.string('job_institution', 150);
    table.date('job_begin_date');
    table.date('job_end_date');
    table.integer('person_id')
    table.boolean('experience_approved').notNullable()
    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('professional_experiences');
  
};
