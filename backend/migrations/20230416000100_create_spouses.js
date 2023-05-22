/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('spouses', (table) => {
    table.increments('spouse_id').primary()

    table.integer('student_id').unsigned().notNullable();
    table.string('phone_number', 15).notNullable();
    table.boolean('is_whatsapp').notNullable();
    table.string('alternative_email', 150).unique().notNullable();
    table.integer('person_id').unsigned().notNullable();
    table.integer('origin_field_id').unsigned().notNullable();
    table.string('justification', 400).notNullable();
    table.string('birth_city', 250).notNullable();
    table.string('birth_state', 2).notNullable();
    table.string('primary_school_city', 250).notNullable();
    table.string('primary_school_state', 250).notNullable();
    table.date('birth_date').notNullable();
    table.date('baptism_date').notNullable();
    table.string('baptism_place', 250).notNullable();
    table.date('civil_marriage_date');
    table.string('civil_marriage_city', 250);
    table.string('civil_marriage_state', 250);
    table.string('registry', 250);
    table.string('registry_number', 150);
    table.boolean('spouse_approved')

    table
      .foreign('person_id')
      .references('people.person_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
      .foreign('origin_field_id')
      .references('associations.association_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
    .foreign('student_id')
    .references('students.student_id')
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

  return knex.schema.dropTable('spouses');
  
};
