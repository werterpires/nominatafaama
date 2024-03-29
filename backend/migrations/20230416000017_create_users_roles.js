/**

@param { import("knex").Knex } knex
@returns { Promise<void> }
*/
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('users_roles', (table) => {
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('users.user_id')
    table.integer('role_id').unsigned()
    table.foreign('role_id').references('roles.role_id')
    table.primary(['user_id', 'role_id'])
    table.timestamps(true, true)
  })
}
/**

  @param { import("knex").Knex } knex
  @returns { Promise<void> }
  */
exports.down = function (knex) {
  return knex.schema.dropTable('users_roles')
}
