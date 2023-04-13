/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Cria uma nova tabela chamada "roles" (Funções)
  return knex.schema.createTable('roles', (table)=>{
      // Adiciona uma coluna de chave primária chamada "role_id" (ID da função) que auto-incrementa
      table.increments('role_id').primary();
      // Adiciona uma coluna de string chamada "role_name" (Nome da função) que tem um tamanho máximo de 255 e não pode ser nula
      table.string('role_name', 255).notNullable();
      // Adiciona uma coluna de string chamada "role_description" (Descrição da função) que não pode ser nula
      table.string('role_description').notNullable();
      // Adiciona timestamps para as datas de criação e atualização
      table.timestamps(true, true);
  })
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  // Deleta a tabela "roles" (Funções)
  return knex.schema.dropTable('roles');
};
