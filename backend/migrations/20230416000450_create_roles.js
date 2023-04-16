/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('roles', (table)=>{
 
      table.increments('role_id').primary();
      table.string('role_name', 255).notNullable();
      table.string('role_description').notNullable();
      table.timestamps(true, true);
  })
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTable('roles');
};
