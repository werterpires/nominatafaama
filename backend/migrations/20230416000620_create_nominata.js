/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('nominatas', (table) => {
    table.increments('nominata_id').primary()
    table.string('year', 4).notNullable()
    table.date('orig_field_invites_begin').notNullable()
    table.date('other_fields_invites_begin')
    table.string('director_words', 10000).notNullable()
    table.string('class_photo', 250).notNullable()
    table.integer('director').unsigned()

    table.timestamps(true, true)

    table.foreign('director').references('professors.professor_id')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('nominatas')
}
