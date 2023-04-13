/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('courses', (table) => {
    table.increments('course_id').primary();
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
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('courses');
  
};
