/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('students', (table) => {
    table.increments('student_id').primary();
    table.string('phone_number', 15).notNullable();
    table.boolean('is_whatsapp').notNullable();
    table.string('alternative_email', 150).unique().notNullable();
    table.string('student_mensage', 500).notNullable();
    table.integer('person_id').notNullable().unsigned();
    table.integer('origin_field_id').unsigned().notNullable();
    table.string('justification', 400).notNullable();
    table.string('birth_city', 250).notNullable();
    table.string('birth_state', 5).notNullable();
    table.string('baptism_state', 5).notNullable();
    table.string('primary_school_city', 250).notNullable();
    table.string('primary_school_state', 250).notNullable();
    table.date('birth_date').notNullable();
    table.date('baptism_date').notNullable();
    table.string('baptism_place', 250).notNullable();
    table.integer('marital_status_id').unsigned().notNullable();
    table.integer('hiring_status_id').unsigned().notNullable();
    table.boolean('student_approved')
    table.boolean('student_active').notNullable()

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
      .foreign('marital_status_id')
      .references('marital_status_types.marital_status_type_id')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
    table
      .foreign('hiring_status_id')
      .references('hiring_status.hiring_status_id')
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

  return knex.schema.dropTable('students');
  
};
