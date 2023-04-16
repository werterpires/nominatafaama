/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('publications', (table) => {
    table.increments('publication_id').primary();
    table.integer('publication_type_id').notNullable();
    table.string('reference').notNullable();
    table.string('link').notNullable();
    table.boolean('publication_approved').notNullable()


    table.integer('person_id');

    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');

    table
      .foreign('publication_type_id')
      .references('publication_types.publication_type_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
      
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('publications');
};
