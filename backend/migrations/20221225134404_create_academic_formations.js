/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('academic_formations', (table) => {
    table.increments('formation_id').primary();
    table.integer('degree_id');
    table.string('course_area', 150);
    table.string('institution', 150);
    table.date('begin_date');
    table.date('conclusion_date');
    table.integer('person_id')
    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
      .foreign('degree_id')
      .references('academic_degrees.person_id')
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

  return knex.schema.dropTable('academic_formations');
  
};
