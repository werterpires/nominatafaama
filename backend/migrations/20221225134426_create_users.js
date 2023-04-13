/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Create a new table called "users" (Usuários)
  return knex.schema.createTable('users', (table)=>{
      // Add a primary key column called "user_id" (ID do usuário) that auto-increments
      table.increments('user_id').primary();
      // Add a string column called "password_hash" (Hash da senha) that has a max length of 255 and cannot be null
      table.string('password_hash', 255).notNullable();
      // Add an integer column called "person_id" (ID da pessoa) that is unique and has unsigned values
      table.integer('person_id').unique().unsigned()
      // Add a foreign key that references the "person_id" column in the "people" table (Pessoas)
      table.foreign('person_id')
          .references('people.person_id')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');

      // Add timestamps for creation and update dates
      table.timestamps(true, true);

  })
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  // Delete the "users" table (Usuários)
  return knex.schema.dropTable('users');
};
