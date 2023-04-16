/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('evangelistic_experiences', (table) => {
    table.increments('evang_exp_id').primary();
    
    table.string('project', 150);
    table.string('place', 150);
    table.date('exp_begin_date');
    table.date('exp_end_date');
    table.integer('person_id')
    table.integer('evang_exp_type_id')
    table.boolean('evang_exp_approved').notNullable()
    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
    .foreign('evang_exp_type_id')
    .references('evang_exp_types.evang_exp_type_id')
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

  return knex.schema.dropTable('evangelistic_experiences');
  
};
