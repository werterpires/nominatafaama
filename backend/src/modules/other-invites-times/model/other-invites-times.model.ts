import { Injectable } from '@nestjs/common'
import { CreateOtherInvitesTimeDto } from '../dto/create-other-invites-time.dto'
import { UpdateOtherInvitesTimeDto } from '../dto/update-other-invites-time.dto'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { ICreateOtherInvitesTime, IOtherInvitesTime } from '../types/types'

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

  // findAll() {
  //   return `This action returns all otherInvitesTimes`
  // }

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

  update(id: number, updateOtherInvitesTimeDto: UpdateOtherInvitesTimeDto) {
    return `This action updates a #${id} otherInvitesTime`
  }

  remove(id: number) {
    return `This action removes a #${id} otherInvitesTime`
  }
}
