import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateUnion, IUnion, IUpdateUnion } from '../types/types';

@Injectable()
export class UnionsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createUnion({ union_name, union_acronym }: ICreateUnion): Promise<IUnion> {
    let union: IUnion | null = null;
    let sentError: Error | null = null;
  
    await this.knex.transaction(async (trx) => {
      try {
        const [result] = await trx('unions').insert({
          union_name,
          union_acronym,
        });
  
        union = {
          union_id: result,
          union_name,
          union_acronym,
          created_at: new Date(),
          updated_at: new Date(),
        };
  
        await trx.commit();
      } catch (error) {
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Union already exists');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });
  
    if (sentError) {
      throw sentError;
    }
  
    return union!;
  }
  
  async findUnionById(id: number): Promise<IUnion | null> {
    let union: IUnion | null = null;
    let sentError: Error | null = null;
  
    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('unions')
          .select('*')
          .where('union_id', '=', id);
  
        if (result.length < 1) {
          throw new Error('Union not found');
        }
  
        union = {
          union_id: result[0].union_id,
          union_name: result[0].union_name,
          union_acronym: result[0].union_acronym,
          created_at: result[0].created_at,
          updated_at: result[0].updated_at,
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
  
    return union;
  }
  
  async findAllUnions(): Promise<IUnion[]> {
    let unionList: IUnion[] = [];
    let sentError: Error | null = null;
  
    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx.table('unions').select('*');
  
        unionList = results.map((row: any) => ({
          union_id: row.union_id,
          union_name: row.union_name,
          union_acronym: row.union_acronym,
          created_at: row.created_at,
          updated_at: row.updated_at,
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
  
    return unionList;
  }

  async updateUnionById(updateUnion: IUpdateUnion): Promise<IUnion> {
    let updatedUnion: IUnion | null = null;
    let sentError: Error | null = null;
  
    await this.knex.transaction(async (trx) => {
      try {
        const { union_name, union_acronym, union_id } = updateUnion;
  
        await trx('unions')
          .where('union_id', union_id)
          .update({ union_name, union_acronym });
  
        updatedUnion = await this.findUnionById(union_id);
  
        await trx.commit();
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });
  
    if (sentError) {
      throw sentError;
    }
  
    if (updatedUnion === null) {
      throw new Error('Failed to update union.');
    }
  
    return updatedUnion;
  }
  
  async deleteUnionById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';
  
    await this.knex.transaction(async (trx) => {
      try {
        await trx('unions').where('union_id', id).del();
  
        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });
  
    if (sentError) {
      throw sentError;
    }
  
    message = 'Union deleted successfully.';
    return message;
  }
  
  
}
