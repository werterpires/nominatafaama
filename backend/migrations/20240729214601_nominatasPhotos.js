/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('nominata_photos', (table) => {
    table.increments('nominata_photo_id').primary()
    table.string('photo', 300).unique()

    table.integer('nominata_id').unsigned().notNullable()

    table.foreign('nominata_id').references('nominatas.nominata_id')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('nominata_photos')
}
