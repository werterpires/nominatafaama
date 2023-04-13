/**

@param { import("knex").Knex } knex
@returns { Promise<void> }
*/
exports.up = function(knex) {
  // cria a tabela "users_roles" no banco de dados
  return knex.schema.createTable('users_roles', (table)=>{
  // adiciona uma coluna para armazenar o ID do usuário
  // a coluna é marcada como unsigned, o que significa que só aceita valores positivos
  table.integer('user_id').unsigned();
  // adiciona uma chave estrangeira que referencia o ID do usuário na tabela "users"
  table.foreign('user_id')
  // ao excluir um usuário da tabela "users", qualquer linha que contenha o ID desse usuário na tabela "users_roles" também será excluída
  .onDelete('RESTRICT')
  // ao atualizar o ID do usuário na tabela "users", qualquer linha que contenha o ID desse usuário na tabela "users_roles" também será atualizada
  .onUpdate('RESTRICT');
  // adiciona uma coluna para armazenar o ID da função
  // a coluna é marcada como unsigned, o que significa que só aceita valores positivos
  table.integer('role_id').unsigned();
  // adiciona uma chave estrangeira que referencia o ID da função na tabela "roles"
  table.foreign('role_id')
  // ao excluir uma função da tabela "roles", qualquer linha que contenha o ID dessa função na tabela "users_roles" também será excluída
  .onDelete('RESTRICT')
  // ao atualizar o ID da função na tabela "roles", qualquer linha que contenha o ID dessa função na tabela "users_roles" também será atualizada
  .onUpdate('RESTRICT');
  // define a combinação das colunas "user_id" e "role_id" como chave primária da tabela
  table.primary(['user_id', 'role_id']);
  // adiciona colunas para armazenar informações de data e hora da criação e última atualização de cada linha
  table.timestamps(true, true);
  })
  };
  /**

  @param { import("knex").Knex } knex
  @returns { Promise<void> }
  */
  exports.down = function(knex) {
  // exclui a tabela "users_roles" do banco de dados
  return knex.schema.dropTable('users_roles');
};
