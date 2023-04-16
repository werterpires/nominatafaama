/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('previous_marriages', (table) => {
    table.increments('previous_marriage_id').primary()
    table.date('marriage_end_date')
    table.integer('person_id')
    table.boolean('previous_marriage_approved').notNullable()
    table
      .foreign('person_id')
      .references('people.person_id')
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

  return knex.schema.dropTable('previous_marriages');
  
};
