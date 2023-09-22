import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ICreatePublication,
  IPublication,
  IUpdatePublication,
} from '../types/types';

@Injectable()
export class PublicationsModel {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createPublication(
    createPublicationData: ICreatePublication
  ): Promise<IPublication> {
    let publication: IPublication | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          publication_type_id,
          reference,
          link,
          publication_approved,
          person_id,
        } = createPublicationData;

        const [publication_id] = await trx('publications')
          .insert({
            publication_type_id,
            reference,
            link,
            publication_approved,
            person_id,
          })
          .returning('publication_id');

        await trx.commit();

        publication = await this.findPublicationById(publication_id);
      } catch (error) {
        console.error(error);
        await trx.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          sentError = new Error('Publication already exists');
        } else {
          sentError = new Error(error.sqlMessage);
        }
      }
    });

    if (sentError) {
      throw sentError;
    }

    return publication!;
  }

  async findPublicationById(id: number): Promise<IPublication> {
    let publication: IPublication | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const result = await trx
          .table('publications')
          .first(
            'publications.*',
            'publication_types.publication_type',
            'publication_types.instructions'
          )
          .leftJoin(
            'publication_types',
            'publications.publication_type_id',
            'publication_types.publication_type_id'
          )
          .where('publication_id', '=', id);

        if (result.length < 1) {
          throw new Error('Publication not found');
        }

        publication = {
          publication_id: result.publication_id,
          publication_type_id: result.publication_type_id,
          reference: result.reference,
          link: result.link,
          publication_approved: result.publication_approved,
          person_id: result.person_id,
          created_at: result.created_at,
          updated_at: result.updated_at,
          publication_type: result.publication_type,
          instructions: result.instructions,
        };

        await trx.commit();
      } catch (error) {
        sentError = new Error(error.message);
        await trx.rollback();
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (publication == null) {
      throw new Error('Publication not found');
    }

    return publication;
  }

  async findAllPublications(): Promise<IPublication[]> {
    let publicationsList: IPublication[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('publications')
          .select(
            'publications.*',
            'publication_types.publication_type',
            'publication_types.instructions'
          )
          .leftJoin(
            'publication_types',
            'publications.publication_type_id',
            'publication_types.publication_type_id'
          );

        publicationsList = results.map((row: any) => ({
          publication_id: row.publication_id,
          publication_type_id: row.publication_type_id,
          reference: row.reference,
          link: row.link,
          publication_approved: row.publication_approved,
          person_id: row.person_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          publication_type: row.publication_type,
          instructions: row.instructions,
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

    return publicationsList;
  }

  async findAllNotApprovedPersonIds(): Promise<{ person_id: number }[] | null> {
    let personIds: { person_id: number }[] | null = null;
    let sentError: Error | null = null;

    try {
      const studentResult = await this.knex
        .table('publications')
        .join('users', 'users.person_id', 'publications.person_id')
        .select('users.person_id')
        .whereNull('publication_approved');

      const spouseResult = await this.knex
        .table('publications')
        .join('spouses', 'spouses.person_id', 'publications.person_id')
        .join('students', 'students.student_id', 'spouses.student_id')
        .select('students.person_id')
        .whereNull('publications.publication_approved');

      personIds = [...studentResult, ...spouseResult].map((row) => ({
        person_id: row.person_id,
      }));
    } catch (error) {
      console.error('Erro capturado na model: ', error);
      sentError = new Error(error.message);
    }

    return personIds;
  }

  async findPublicationsByPersonId(personId: number): Promise<IPublication[]> {
    let publicationsList: IPublication[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('publications')
          .select(
            'publications.*',
            'publication_types.publication_type',
            'publication_types.instructions'
          )
          .leftJoin(
            'publication_types',
            'publications.publication_type_id',
            'publication_types.publication_type_id'
          )
          .where('publications.person_id', '=', personId);

        publicationsList = results.map((row: any) => ({
          publication_id: row.publication_id,
          publication_type_id: row.publication_type_id,
          reference: row.reference,
          link: row.link,
          publication_approved: row.publication_approved,
          person_id: row.person_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          publication_type: row.publication_type,
          instructions: row.instructions,
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

    return publicationsList;
  }

  async findApprovedPublicationsByPersonId(
    personId: number
  ): Promise<IPublication[]> {
    let publicationsList: IPublication[] = [];
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const results = await trx
          .table('publications')
          .select(
            'publications.*',
            'publication_types.publication_type',
            'publication_types.instructions'
          )
          .leftJoin(
            'publication_types',
            'publications.publication_type_id',
            'publication_types.publication_type_id'
          )
          .where('publications.person_id', '=', personId)
          .where('publications.publication_approved', '=', true);

        publicationsList = results.map((row: any) => ({
          publication_id: row.publication_id,
          publication_type_id: row.publication_type_id,
          reference: row.reference,
          link: row.link,
          publication_approved: row.publication_approved,
          person_id: row.person_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          publication_type: row.publication_type,
          instructions: row.instructions,
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

    return publicationsList;
  }

  async updatePublicationById(
    updatePublication: IUpdatePublication
  ): Promise<number> {
    let updatedPublication: number | null = null;
    let sentError: Error | null = null;

    await this.knex.transaction(async (trx) => {
      try {
        const {
          publication_id,
          publication_type_id,
          reference,
          link,
          publication_approved,
        } = updatePublication;

        let approved = await trx('publications')
          .first('publication_approved')
          .where('publication_id', publication_id);

        if (approved.publication_approved == true) {
          throw new Error('Registro já aprovado');
        }

        updatedPublication = await trx('publications')
          .where('publication_id', publication_id)
          .update({
            publication_type_id,
            reference,
            link,
            publication_approved,
          });

        await trx.commit();
      } catch (error) {
        await trx.rollback();
        sentError = new Error(error.message);
      }
    });

    if (sentError) {
      throw sentError;
    }

    if (updatedPublication == null) {
      throw new Error('publication not found');
    }

    return updatedPublication;
  }

  async deletePublicationById(id: number): Promise<string> {
    let sentError: Error | null = null;
    let message: string = '';

    await this.knex.transaction(async (trx) => {
      try {
        const existingPublication = await trx('publications')
          .select('publication_id')
          .where('publication_id', id)
          .first();

        if (!existingPublication) {
          throw new Error('Publication not found');
        }

        let approved = await trx('publications')
          .first('publication_approved')
          .where('publication_id', id);

        if (approved.publication_approved == true) {
          throw new Error('Registro já aprovado');
        }

        await trx('publications').where('publication_id', id).del();

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

    message = 'Publication deleted successfully';
    return message;
  }
}
