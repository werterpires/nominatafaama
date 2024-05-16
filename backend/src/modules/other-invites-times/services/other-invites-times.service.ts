import { Injectable } from '@nestjs/common'
import { CreateOtherInvitesTimeDto } from '../dto/create-other-invites-time.dto'
import { UpdateOtherInvitesTimeDto } from '../dto/update-other-invites-time.dto'
import { OtherInvitesTimesModel } from '../model/other-invites-times.model'
import { ICreateOtherInvitesTime } from '../types/types'

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

      console.log('service', createOtherInvitesTimeData)

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
}
