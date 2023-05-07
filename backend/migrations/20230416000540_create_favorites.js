/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('favorites', (table) => {
    table.increments('favorite_id').primary();
    table.integer('rep_id').unsigned().notNullable();
    table.integer('student_id').unsigned().notNullable();

    table
      .foreign('rep_id')
      .references('field_reps.rep_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
      table
      .foreign('student_id')
      .references('students.student_id')
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

  return knex.schema.dropTable('favorites');
  
};
