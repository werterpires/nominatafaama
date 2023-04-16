/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('ecl_experiences', (table) => {
    table.increments('ecl_exp_id').primary();
    
    table.integer('person_id')
    table.integer('ecl_exp_type_id')
    table.boolean('ecl_exp_approved').notNullable()
    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
    .foreign('ecl_exp_type_id')
    .references('ecl_exp_types.ecl_exp_type_id')
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

  return knex.schema.dropTable('ecl_experiences');
  
};
