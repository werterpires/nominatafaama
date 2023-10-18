import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateStudent, IStudent, IUpdateStudent } from '../types/types';
import { IHiringField } from 'src/modules/nominatas/types/types';

@Injectable()
export class StudentsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createStudent(
    createStudent: ICreateStudent,
    name: string
  ): Promise<IStudent> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const [student_id] = await trx('students')
          .insert({
            ...createStudent,
            student_active: true,
          })
          .returning('student_id');

        await trx.commit();

        student = await this.findStudentById(student_id);
      } catch (error) {
        console.error(error);
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
    const result = await this.knex
      .table('students')
      .first(
        'students.*',
        'hiring_status.*',
        'marital_status_types.*',
        'associations.*',
        'unions.*',
        'people.name as person_name',
        'people.person_id as person_id'
      )
      .leftJoin('users', 'students.person_id', 'users.person_id')
      .leftJoin('people', 'students.person_id', 'people.person_id')
      .leftJoin(
        'marital_status_types',
        'students.marital_status_id',
        'marital_status_types.marital_status_type_id'
      )
      .leftJoin(
        'hiring_status',
        'students.hiring_status_id',
        'hiring_status.hiring_status_id'
      )
      .leftJoin(
        'associations',
        'students.origin_field_id',
        'associations.association_id'
      )
      .leftJoin('unions', 'associations.union_id', 'unions.union_id')
      .where('students.student_id', '=', id);

    if (!result) {
      throw new Error('Estudante não encontrado');
    }

    return result;
  }

  async findNotApprovedIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null;
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .select('students.person_id')
        .whereNull('students.student_approved');

      if (result) {
        personIds = result;
      }
    } catch (error) {
      console.error('Erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    return personIds;
  }

  async findStudentByUserId(userId: number): Promise<IStudent | null> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .first(
          'students.*',
          'hiring_status.*',
          'marital_status_types.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id'
        )
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'students.person_id', 'people.person_id')
        .leftJoin(
          'marital_status_types',
          'students.marital_status_id',
          'marital_status_types.marital_status_type_id'
        )
        .leftJoin(
          'hiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations',
          'students.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('users.user_id', userId);

      if (result != null) {
        student = result;
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
    }

    return student;
  }

  async findActiveByUserId(userId: number): Promise<boolean | null> {
    let acctive: boolean | null = null;
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .first('students.student_active')
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .where('users.user_id', userId);
      if (result) {
        acctive = result.student_active;
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
    }

    return acctive;
  }

  async findHiringField(studentId: number) {
    let hiringField: IHiringField | null = null;
    let sentError: Error | null = null;
    try {
      let result = await this.knex
        .first(
          'students.student_id',
          'associations.association_acronym',
          'unions.union_acronym'
        )
        .from('students')
        .leftJoin(
          'vacancies_students',
          'students.student_id',
          'vacancies_students.student_id'
        )
        .leftJoin(
          'vacancies',
          'vacancies_students.vacancy_id',
          'vacancies.vacancy_id'
        )
        .leftJoin(
          'associations',
          'vacancies.field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .leftJoin(
          'invites',
          'vacancies_students.vacancy_student_id',
          'invites.vacancy_student_id'
        )
        .where('students.student_id', studentId)
        .andWhere('invites.accept', true)
        .andWhere('invites.approved', true);

      if (result != null) {
        hiringField = {
          association_acronym: result.association_acronym,
          student_id: result.student_id,
          union_acronym: result.union_acronym,
        };
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
    }

    return hiringField;
  }

  async findActiveStudents(): Promise<{ cpf: string; name: string }[]> {
    let activeStudents: { cpf: string; name: string }[] = [];
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .select('people.cpf', 'people.name')
        .leftJoin('people', 'students.person_id', 'people.person_id')
        .where('students.student_active', true);
      if (result) {
        activeStudents = result;
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
    }

    return activeStudents;
  }

  async findApprovedStudentByUserId(
    studentId: number
  ): Promise<IStudent | null> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .first(
          'students.*',
          'hiring_status.*',
          'marital_status_types.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id'
        )
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'students.person_id', 'people.person_id')
        .leftJoin(
          'marital_status_types',
          'students.marital_status_id',
          'marital_status_types.marital_status_type_id'
        )
        .leftJoin(
          'hiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations',
          'students.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('students.student_id', studentId)
        .andWhere('students.student_approved', true);

      if (result != null) {
        student = result;
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
    }

    return student;
  }

  async findStudentByUserCpf(cpf: string): Promise<IStudent | null> {
    let student: IStudent | null = null;
    let sentError: Error | null = null;
    try {
      const result = await this.knex
        .table('students')
        .first(
          'students.*',
          'hiring_status.*',
          'marital_status_types.*',
          'associations.*',
          'unions.*',
          'people.name as person_name',
          'people.person_id as person_id'
        )
        .leftJoin('users', 'students.person_id', 'users.person_id')
        .leftJoin('people', 'students.person_id', 'people.person_id')
        .leftJoin(
          'marital_status_types',
          'students.marital_status_id',
          'marital_status_types.marital_status_type_id'
        )
        .leftJoin(
          'hiring_status',
          'students.hiring_status_id',
          'hiring_status.hiring_status_id'
        )
        .leftJoin(
          'associations',
          'students.origin_field_id',
          'associations.association_id'
        )
        .leftJoin('unions', 'associations.union_id', 'unions.union_id')
        .where('people.cpf', cpf);

      if (result != null) {
        student = result;
      }
    } catch (error) {
      console.error('Esse é o erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    if (sentError) {
      throw sentError;
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
            'people.name' // Adiciona a coluna 'name' da tabela 'people'
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
          person_name: row.name,
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
        console.error(error);
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
          primary_school_state,
          student_approved,
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
          primary_school_state,
          student_approved,
        });

        await trx.commit();
      } catch (error) {
        console.error(error);
        console.error(error);
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    updatedStudent = await this.findStudentById(updateStudent.student_id);
    if (updatedStudent === null) {
      throw new Error('Falha ao atualizar estudante.');
    }

    return updatedStudent;
  }

  async turnStudentActiveToFalse(activeCpfs: string[]): Promise<boolean> {
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        await trx('students')
          .leftJoin('people', 'students.person_id', 'people.person_id')
          .update({
            student_active: false,
          })
          .whereNotIn('people.cpf', activeCpfs);

        await trx.commit();
      } catch (error) {
        console.error('Erro capturado na Model:', error);
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    return true;
  }

  async deleteStudentById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        await trx('students').where('student_id', id).del();

        await trx.commit();
      } catch (error) {
        console.error(error);
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
