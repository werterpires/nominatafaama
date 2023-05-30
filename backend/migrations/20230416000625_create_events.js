/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('events', (table) => {
    table.increments('event_id').primary()
    table.date('event_date').notNullable()
    table.string('event_time')
    table.string('event_place')
    table.string('event_address')

    table.integer('nominata_id').unsigned().notNullable()

    table
      .foreign('nominata_id')
      .references('nominatas.nominata_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('events')
}
