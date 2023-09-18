/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('nominatas_professors', (table) => {
    table.increments('nominata_professors_id').primary()
    table.integer('nominata_id').unsigned().notNullable()
    table.integer('professor_id').unsigned().notNullable()

    table.foreign('nominata_id').references('nominatas.nominata_id')
    table.foreign('professor_id').references('professors.professor_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('nominatas_professors')
}
