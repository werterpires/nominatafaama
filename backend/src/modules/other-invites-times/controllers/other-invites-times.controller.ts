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
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'

@Controller('other-invites-times')
export class OtherInvitesTimesController {
  constructor(
    private readonly otherInvitesTimesService: OtherInvitesTimesService
  ) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Post()
  async create(@Body() createOtherInvitesTimeDto: CreateOtherInvitesTimeDto) {
    try {
      console.log('controller', createOtherInvitesTimeDto)
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
