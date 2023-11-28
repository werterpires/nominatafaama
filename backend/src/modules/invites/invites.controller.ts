import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Put
} from '@nestjs/common'
import { InvitesService } from './services/invites.service'
import { CreateInviteDto } from './dto/create-invite.dto'
import {
  AcceptInviteDto,
  EvaluateInvite,
  UpdateInviteDto
} from './dto/update-invite.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { UserFromJwt } from 'src/shared/auth/types/types'

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Post()
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const inviteId = await this.invitesService.createInvite(
        createInviteDto,
        currentUser
      )

      return {
        inviteId
      }
    } catch (error) {
      console.error('erro capturado em createInvite em Invitescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.REPRESENTACAO)
  @Delete(':inviteId')
  async deleteInvite(
    @Param('inviteId') inviteId: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      this.invitesService.deleteInvite(+inviteId, currentUser)
    } catch (error) {
      console.error('erro capturado em deleteInvite em Invitescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.DIRECAO, ERoles.ADMINISTRACAO)
  @Put('evaluate')
  async evaluateInvite(
    @Body() evaluateInviteDto: EvaluateInvite,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      this.invitesService.evaluateInvite(evaluateInviteDto, currentUser)
    } catch (error) {
      console.error('erro capturado em evaluateInvite em Invitescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ESTUDANTE, ERoles.ADMINISTRACAO)
  @Put('accept')
  async acceptInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      this.invitesService.acceptInvite(acceptInviteDto, currentUser)
    } catch (error) {
      console.error('erro capturado em acceptInvite em Invitescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.DIRECAO, ERoles.ADMINISTRACAO)
  @Put('rep/:repId')
  async findAllRepInvites(@Param('repId') repId: string) {
    try {
      const invites = await this.invitesService.findAllRepInvites(+repId)
      return invites
    } catch (error) {
      console.error('erro capturado em findAllRepInvites em Invitescontroller')
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.DIRECAO, ERoles.ADMINISTRACAO)
  @Put('notEvaluated')
  async findAllNotEvaluatedInvites() {
    try {
      const invites = await this.invitesService.findAllNotEvaluatedInvites()
      return invites
    } catch (error) {
      console.error(
        'erro capturado em findAllNotEvaluatedInvites em Invitescontroller'
      )
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.DIRECAO, ERoles.ADMINISTRACAO)
  @Put('student/:studentId')
  async findAllStudentInvites(@Param('studentId') studentId: string) {
    try {
      const invites = await this.invitesService.findAllStudentInvites(
        +studentId
      )
      return invites
    } catch (error) {
      console.error(
        'erro capturado em findAllNotEvaluatedInvites em Invitescontroller'
      )
      throw new InternalServerErrorException(error.message)
    }
  }
}
