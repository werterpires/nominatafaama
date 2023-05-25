import {Injectable} from '@nestjs/common';
import {Knex} from 'knex';
import {InjectModel} from 'nest-knexjs';
import {ICreateStudent, IStudent, IUpdateStudent} from '../types/types';

@Injectable()
export class StudentsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createStudent(
    createStudent: ICreateStudent,
    name: string,
  ): Promise<IStudent> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('students').insert({
          ...createStudent,
          student_approved: null,
          student_active: true,
        });

        await trx.commit();

        student = await this.findStudentById(result);
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Estudante já existe');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return student!;
  }

  async findStudentById(id: number): Promise<IStudent | null> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('students')
          .select(
            'students.*',
            'hiring_status.*',
            'marital_status_types.*',
            'associations.*',
            'unions.*',
            'people.name as person_name',
            'people.person_id as person_id',
          )
          .leftJoin('users', 'students.person_id', 'users.person_id')
          .leftJoin('people', 'students.person_id', 'people.person_id')
          .leftJoin(
            'marital_status_types',
            'students.marital_status_id',
            'marital_status_types.marital_status_type_id',
          )
          .leftJoin(
            'hiring_status',
            'students.hiring_status_id',
            'hiring_status.hiring_status_id',
          )
          .leftJoin(
            'associations',
            'students.origin_field_id',
            'associations.association_id',
          )
          .leftJoin('unions', 'associations.union_id', 'unions.union_id')
          .where('students.student_id', '=', id);

        if (result.length < 1) {
          throw new Error('Estudante não encontrado');
        }

        student = {
          student_id: result[0].student_id,
          phone_number: result[0].phone_number,
          is_whatsapp: result[0].is_whatsapp,
          alternative_email: result[0].alternative_email,
          student_mensage: result[0].student_mensage,
          person_id: result[0].person_id,
          origin_field_id: result[0].origin_field_id,
          justification: result[0].justification,
          birth_city: result[0].birth_city,
          birth_state: result[0].birth_state,
          primary_school_city: result[0].primary_school_city,
          birth_date: result[0].birth_date,
          baptism_date: result[0].baptism_date,
          baptism_place: result[0].baptism_place,
          marital_status_id: result[0].marital_status_id,
          hiring_status_id: result[0].hiring_status_id,
          student_approved: result[0].student_approved,
          student_active: result[0].student_active,
          primary_school_state: result[0].primary_school_state,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
          name: result[0].name,
          association_name: result[0].association_name,
          association_acronym: result[0].association_acronym,
          union_name: result[0].union_name,
          union_acronym: result[0].union_acronym,
          union_id: result[0].union_id,
          marital_status_type_name: result[0].marital_status_type_name,
          hiring_status_name: result[0].hiring_status_name,
          hiring_status_description: result[0].hiring_status_description,
        };

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
        throw error;
      }
    });

    if (sentError) {
      throw sentError;
    }

    return student;
  }

  async findStudentByUserId(userId: number): Promise<IStudent> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;

    try {
      const result = await this.knex('students')
        .select(
          'students.*',
          'hiring_status.*',
          'marital_status_types.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id',
        )
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'students.person_id', 'people.person_id')
        .leftJoin(
          'marital_status_types',
          'students.marital_status_id',
          'marital_status_types.marital_status_type_id',
        )
        .leftJoin(
          'hiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id',
        )
        .leftJoin(
          'associations',
          'students.origin_field_id',
          'associations.association_id',
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('users.user_id', userId);

      if (result.length < 1) {
        throw new Error('Estudante não encontrado');
      }

      student = result[0];
    } catch (error) {
      console.log(error);
      sentError = new Error(error.message);
    }
    if (sentError) {
      throw sentError;
    }
    if (student == null) {
      throw new Error('Estudante não encontrado.');
    }
    return student;
  }

  async findAllStudents(): Promise<IStudent[]> {
    let studentList: IStudent[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx('students')
          .select(
            'students.student_id',
            'students.phone_number',
            'students.is_whatsapp',
            'students.alternative_email',
            'students.student_mensage',
            'students.person_id',
            'students.origin_field_id',
            'students.justification',
            'students.birth_city',
            'students.birth_state',
            'students.primary_school_city',
            'students.birth_date',
            'students.baptism_date',
            'students.baptism_place',
            'students.marital_status_id',
            'students.hiring_status_id',
            'students.student_approved',
            'students.student_active',
            'students.created_at',
            'students.updated_at',
            'people.name', // Adiciona a coluna 'name' da tabela 'people'
          )
          .leftJoin('people', 'students.person_id', 'people.person_id'); // Faz o left join com a tabela 'people'

        studentList = results.map((row: any) => ({
          student_id: row.student_id,
          phone_number: row.phone_number,
          is_whatsapp: row.is_whatsapp,
          alternative_email: row.alternative_email,
          student_mensage: row.student_mensage,
          person_id: row.person_id,
          origin_field_id: row.origin_field_id,
          justification: row.justification,
          birth_city: row.birth_city,
          birth_state: row.birth_state,
          primary_school_city: row.primary_school_city,
          birth_date: row.birth_date,
          baptism_date: row.baptism_date,
          baptism_place: row.baptism_place,
          marital_status_id: row.marital_status_id,
          hiring_status_id: row.hiring_status_id,
          student_approved: row.student_approved,
          student_active: row.student_active,
          primary_school_state: row.primary_school_state,
          created_at: row.created_at,
          updated_at: row.updated_at,
          name: row.name,
          association_name: row.association_name,
          association_acronym: row.association_acronym,
          union_name: row.union_name,
          union_acronym: row.union_acronym,
          union_id: row.union_id,
          marital_status_type_name: row.marital_status_type_name,
          hiring_status_name: row.hiring_status_name,
          hiring_status_description: row.hiring_status_description,
        }));

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.sqlMessage);
      }
    });

    if (sentError) {
      throw sentError;
    }

    return studentList;
  }

  async updateStudentById(updateStudent: IUpdateStudent): Promise<IStudent> {
    let updatedStudent: IStudent | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          student_id,
          phone_number,
          is_whatsapp,
          alternative_email,
          student_mensage,
          person_id,
          origin_field_id,
          justification,
          birth_city,
          birth_state,
          primary_school_city,
          birth_date,
          baptism_date,
          baptism_place,
          marital_status_id,
          hiring_status_id,
          primary_school_state,
        } = updateStudent;

        await trx('students').where('student_id', student_id).update({
          phone_number,
          is_whatsapp,
          alternative_email,
          student_mensage,
          person_id,
          origin_field_id,
          justification,
          birth_city,
          birth_state,
          primary_school_city,
          birth_date,
          baptism_date,
          baptism_place,
          marital_status_id,
          hiring_status_id,
          primary_school_state,
        });

        updatedStudent = await this.findStudentById(student_id);

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedStudent === null) {
      throw new Error('Falha ao atualizar estudante.');
    }

    return updatedStudent;
  }

  async deleteStudentById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        await trx('students').where('student_id', id).del();

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    message = 'Estudante excluído com sucesso.';
    return message;
  }
}
