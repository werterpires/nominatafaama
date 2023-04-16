/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('field_reps', (table) => {
    table.increments('rep_id').primary();
    table.string('phone_number', 15).notNullable();
    table.string('principal_email', 150).unique().notNullable();
    table.integer('person_id').unsigned();

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

  return knex.schema.dropTable('field_reps');
  
};
