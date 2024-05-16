import { Injectable } from '@nestjs/common'
import { CreateOtherInvitesTimeDto } from '../dto/create-other-invites-time.dto'
import { UpdateOtherInvitesTimeDto } from '../dto/update-other-invites-time.dto'
import { OtherInvitesTimesModel } from '../model/other-invites-times.model'
import {
  ICreateOtherInvitesTime,
  IUpdateOtherInvitesTime
} from '../types/types'

@Injectable()
export class OtherInvitesTimesService {
  constructor(private otherInvitesTimesModel: OtherInvitesTimesModel) {}
  async createOtherInvitesTime(
    createOtherInvitesTimeDto: CreateOtherInvitesTimeDto
  ) {
    try {
      const existentInviteTime =
        await this.otherInvitesTimesModel.findInvitTimeByFieldAndNominataYear({
          nominataId: createOtherInvitesTimeDto.nominataId,
          fieldIdId: createOtherInvitesTimeDto.fieldId
        })

      if (existentInviteTime) {
        throw new Error('Other invites time already exists')
      }

      const invites_begin = new Date(createOtherInvitesTimeDto.invitesBegin)
      if (invites_begin.toString() === 'Invalid Date') {
        throw new Error('Invalid Date')
      }

      const createOtherInvitesTimeData: ICreateOtherInvitesTime = {
        nominata_id: createOtherInvitesTimeDto.nominataId,
        invites_begin,
        field_id: createOtherInvitesTimeDto.fieldId
      }

      const createdOtherInvitesTime =
        await this.otherInvitesTimesModel.createOtherInvitesTime(
          createOtherInvitesTimeData
        )

      return createdOtherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async findAllInvitesTimesByNominataId(
    nominataId: number
  ): Promise<ICreateOtherInvitesTime[]> {
    try {
      const consultResult =
        await this.otherInvitesTimesModel.findAllInvitesTimesByNominataId(
          nominataId
        )
      return consultResult
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateOtherInvitesTime(
    updateOtherInvitesTimeDto: UpdateOtherInvitesTimeDto
  ) {
    try {
      const invites_begin = new Date(updateOtherInvitesTimeDto.invitesBegin)
      if (invites_begin.toString() === 'Invalid Date') {
        throw new Error('Invalid Date')
      }
      const updateOtherInvitesTimeData: IUpdateOtherInvitesTime = {
        fields_invites_id: updateOtherInvitesTimeDto.otherInvitesTimeId,
        invites_begin
      }

      await this.otherInvitesTimesModel.updateOtherInvitesTime(
        updateOtherInvitesTimeData
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteOtherInvitesTime(fields_invites_id: number) {
    try {
      await this.otherInvitesTimesModel.deleteOtherInvitesTime(
        fields_invites_id
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
