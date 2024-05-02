import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { OtherInvitesTimesService } from '../services/other-invites-times.service'
import { CreateOtherInvitesTimeDto } from '../dto/create-other-invites-time.dto'
import { UpdateOtherInvitesTimeDto } from '../dto/update-other-invites-time.dto'

@Controller('other-invites-times')
export class OtherInvitesTimesController {
  constructor(
    private readonly otherInvitesTimesService: OtherInvitesTimesService
  ) {}

  @Post()
  async create(@Body() createOtherInvitesTimeDto: CreateOtherInvitesTimeDto) {
    try {
      const createdOtherInvitesTime =
        await this.otherInvitesTimesService.createOtherInvitesTime(
          createOtherInvitesTimeDto
        )
      return createdOtherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
