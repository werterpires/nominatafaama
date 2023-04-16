/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  
  return knex.schema.createTable('student_photos', (table) => {
    table.increments('photo_pack_id').primary();
    table.string('alone_photo', 300).unique()
    table.string('family_photo', 300).unique()
    table.string('other_family_photo', 300).unique()
    table.string('spouse_photo', 300).unique()
    table.string('invite_photo', 300).unique()
    
    table.integer('student_id').notNullable()
    table.integer('ministry_type_id').notNullable()
    table.integer('priority').notNullable()
    table.boolean('related_ministry_approved').notNullable()

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

  return knex.schema.dropTable('related_ministries');
  
};
