/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('nominatas_students', (table) => {
    table.increments('nominata_student_id').primary();
    table.integer('nominata_id').notNullable()
    table.integer('student_id').notNullable()

    table
      .foreign('nominata_id')
      .references('nominatas.nominata_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')
    table
      .foreign('student_id')
      .references('students.student_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table.timestamps(true, true)

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

  return knex.schema.dropTable('nominatas_students');
  
};
