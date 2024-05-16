import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put
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
      const createdOtherInvitesTime =
        await this.otherInvitesTimesService.createOtherInvitesTime(
          createOtherInvitesTimeDto
        )
      return createdOtherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Get('nominata/:nomintaId')
  async findAllInvitesTimesByNominataId(
    @Param('nomintaId') nominataId: string
  ) {
    try {
      const invitesTimes =
        await this.otherInvitesTimesService.findAllInvitesTimesByNominataId(
          Number(nominataId)
        )
      return invitesTimes
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Put()
  async updateOtherInvitesTime(
    @Body() updateOtherInvitesTimeDto: UpdateOtherInvitesTimeDto
  ) {
    try {
      const updatedOtherInvitesTime =
        await this.otherInvitesTimesService.updateOtherInvitesTime(
          updateOtherInvitesTimeDto
        )
      return updatedOtherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DIRECAO)
  @Delete(':otherInvitesTimeId')
  async remove(@Param('otherInvitesTimeId') otherInvitesTimeId: string) {
    try {
      const deletedOtherInvitesTime =
        await this.otherInvitesTimesService.deleteOtherInvitesTime(
          Number(otherInvitesTimeId)
        )
      return deletedOtherInvitesTime
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
