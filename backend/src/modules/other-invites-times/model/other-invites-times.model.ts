import { Injectable } from '@nestjs/common'
import { CreateOtherInvitesTimeDto } from '../dto/create-other-invites-time.dto'
import { UpdateOtherInvitesTimeDto } from '../dto/update-other-invites-time.dto'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import {
  ICreateOtherInvitesTime,
  IOtherInvitesTime,
  IUpdateOtherInvitesTime
} from '../types/types'

@Injectable()
export class OtherInvitesTimesModel {
  @InjectModel() private readonly knex: Knex
  async createOtherInvitesTime(
    createOtherInviteTimesData: ICreateOtherInvitesTime
  ): Promise<IOtherInvitesTime> {
    let otherInvitesTime: IOtherInvitesTime | null = null
    let sentError: Error | null = null

    try {
      const [otherInvitesTimeId] = await this.knex
        .table('fields_invites_begins')
        .insert(createOtherInviteTimesData)

      otherInvitesTime = await this.findOneOtherInvitesTimeById(
        otherInvitesTimeId
      )

      return otherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async findAllInvitesTimesByNominataId(
    nominataId: number
  ): Promise<IOtherInvitesTime[]> {
    try {
      const consultResult = await this.knex
        .select([
          'fields_invites_begins.*',
          'nominatas.nominata_id',
          'nominatas.year',
          'nominatas.orig_field_invites_begin',
          'nominatas.other_fields_invites_begin',
          'nominatas.director',
          'associations.*'
        ])
        .from('fields_invites_begins')
        .leftJoin(
          'nominatas',
          'nominatas.nominata_id',
          'fields_invites_begins.nominata_id'
        )
        .leftJoin(
          'associations',
          'associations.association_id',
          'fields_invites_begins.field_id'
        )
        .where('nominatas.nominata_id', nominataId)

      const otherInvitesTimes: IOtherInvitesTime[] = consultResult.map(
        (result) => {
          return {
            fields_invites_id: result.fields_invites_id,
            nominata_id: result.nominata_id,
            invites_begin: result.invites_begin,
            field_id: result.association_id,
            field: {
              association_id: result.association_id,
              association_name: result.association_name,
              association_acronym: result.association_acronym,
              union_id: result.union_id
            },
            nominata: {
              nominata_id: result.nominata_id,
              year: result.year,
              orig_field_invites_begin: result.orig_field_invites_begin,
              other_fields_invites_begin: result.other_fields_invites_begin,
              director: result.director
            }
          }
        }
      )

      return otherInvitesTimes
    } catch (error) {
      console.log('Erro capturado no model:', error)
      throw new Error('Failed to find other invites time')
    }
  }

  async findOneOtherInvitesTimeById(
    otherInvitesTmeId: number
  ): Promise<IOtherInvitesTime> {
    try {
      const consultResult = await this.knex
        .first([
          'fields_invites_begins.*',
          'nominatas.nominata_id',
          'nominatas.year',
          'nominatas.orig_field_invites_begin',
          'nominatas.other_fields_invites_begin',
          'nominatas.director',
          'associations.*'
        ])
        .from('fields_invites_begins')
        .leftJoin(
          'nominatas',
          'nominatas.nominata_id',
          'fields_invites_begins.nominata_id'
        )
        .leftJoin(
          'associations',
          'associations.association_id',
          'fields_invites_begins.field_id'
        )
        .where('fields_invites_begins.fields_invites_id', otherInvitesTmeId)

      const otherInvitesTime: IOtherInvitesTime = {
        fields_invites_id: consultResult.association_id,
        nominata_id: consultResult.nominata_id,
        invites_begin: consultResult.invites_begin,
        field_id: consultResult.association_id,
        field: {
          association_id: consultResult.association_id,
          association_name: consultResult.association_name,
          association_acronym: consultResult.association_acronym,
          union_id: consultResult.union_id
        },
        nominata: {
          nominata_id: consultResult.nominata_id,
          year: consultResult.year,
          orig_field_invites_begin: consultResult.orig_field_invites_begin,
          other_fields_invites_begin: consultResult.other_fields_invites_begin,
          director: consultResult.director
        }
      }

      return otherInvitesTime
    } catch (error) {
      console.log('Erro capturado no model:', error)
      throw new Error('Failed to find other invites time')
    }
  }

  async findInvitTimeByFieldAndNominataYear(data: {
    nominataId: number
    fieldIdId: number
  }): Promise<any> {
    try {
      const consultResult = await this.knex('fields_invites_begins')
        .first('fields_invites_id')
        .where('field_id', data.fieldIdId)
        .andWhere('nominata_id', data.nominataId)

      return consultResult
    } catch (error) {
      console.log(
        'Erro capturado no findInvitTimeByFieldAndNominataYear model:',
        error
      )
      throw new Error('Failed to find other invites time')
    }
  }

  async updateOtherInvitesTime(
    updateOtherInvitesTimeData: IUpdateOtherInvitesTime
  ): Promise<void> {
    try {
      await this.knex
        .table('fields_invites_begins')
        .update({ invites_begin: updateOtherInvitesTimeData.invites_begin })
        .where(
          'fields_invites_begins.fields_invites_id',
          updateOtherInvitesTimeData.fields_invites_id
        )
    } catch (error) {
      console.log('Erro capturado no model:', error)
      throw new Error('Failed to update other invites time')
    }
  }

  async deleteOtherInvitesTime(fields_invites_id: number): Promise<void> {
    try {
      await this.knex
        .table('fields_invites_begins')
        .delete()
        .where('fields_invites_begins.fields_invites_id', fields_invites_id)
    } catch (error) {
      console.log('Erro capturado no model:', error)
      throw new Error('Failed to delete other invites time')
    }
  }
}
