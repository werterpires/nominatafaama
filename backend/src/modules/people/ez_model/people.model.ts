import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ICreatePerson, IPerson, IUpdatePerson } from '../bz_types/types';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class PeopleModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createPerson({ name, cpf }: ICreatePerson): Promise<IPerson> {
    let person: IPerson;

    person = await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx
          .table('people')
          .insert({
            name,
            cpf,
          })
          .returning('*');

        person = result as IPerson;
        await trx.commit();
      } catch (error) {
        await trx.rollback();

        return error;
      }
    });
    return person;
  }

  async findPersonById(id: number): Promise<IPerson | null> {
    let person!: IPerson;

    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx
          .table('people')
          .select('*')
          .where('person_id', '=', id);
        if (result.length > 0) {
          person = result as IPerson;
        }
        await trx.commit();
      } catch (error) {
        await trx.rollback();

        throw error;
      }
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!person) {
      throw new Error(`Person with id ${id} not found.`);
    }
    return person;
  }

  async findAllPeople(): Promise<IPerson[]> {
    let people: IPerson[] = [];

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('people').select('*');

        people = results as IPerson[];

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    });

    return people;
  }

  async updatePersonById({ id, name, cpf }: IUpdatePerson): Promise<IPerson> {
    let updatedPerson: IPerson | null = null;
    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx
          .table('people')
          .where({ person_id: id })
          .update({
            name,
            cpf,
            updated_at: new Date(),
          })
          .returning('*');

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!result) {
          throw new Error(`Person with id ${id} not found.`);
        }

        updatedPerson = result as IPerson;

        await trx.commit();
      } catch (error) {
        await trx.rollback();

        throw error;
      }
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!updatedPerson) {
      throw new Error(`Person with id ${id} not found.`);
    }

    return updatedPerson;
  }
}
