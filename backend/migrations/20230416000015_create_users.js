/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('users', (table)=>{
   
      table.increments('user_id').primary();

      table.string('password_hash', 255).notNullable();

      table.integer('person_id').unique().unsigned();

      table.string('principal_email', 150).unique().notNullable();

      table.boolean('user_approved')

      table.boolean('consent_term')

      table.boolean('cookies')

      table.foreign('person_id')
          .references('people.person_id')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');
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
