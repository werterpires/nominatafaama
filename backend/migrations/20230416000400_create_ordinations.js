/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('ordinations', (table) => {
    table.increments('evang_exp_id').primary();
    
    table.string('ordination_name', 150).notNullable();
    table.string('place', 150).notNullable();
    table.integer('Year').notNullable();
    table.integer('person_id').notNullable()
    table.boolean('ordination_approved').notNullable()
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

  return knex.schema.dropTable('ordinations');
  
};
