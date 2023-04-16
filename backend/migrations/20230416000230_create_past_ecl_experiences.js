/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('past_ecl_exps', (table) => {
    table.increments('past_ecl_id').primary();
    
    table.string('function', 150);
    table.string('place', 150);
    table.date('past_exp_begin_date');
    table.date('past_exp_end_date');
    table.integer('person_id')
    table.boolean('past_ecl_approved').notNullable()
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

  return knex.schema.dropTable('past_ecl_exps');
  
};
