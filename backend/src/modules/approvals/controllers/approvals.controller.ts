import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ApprovalsService } from '../services/approvals.service'
import { CreateApprovalDto } from '../dto/create-approval.dto'
import { UpdateApprovalDto } from '../dto/update-approval.dto'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { IUser } from 'src/modules/users/bz_types/types'
import { ICompleteStudent, ICompleteUser } from '../types/types'

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get()
  async findNotApproved(): Promise<ICompleteUser[] | null> {
    try {
      const users = await this.approvalsService.findNotApproved()
      return users
    } catch (error) {
      console.error(
        'Erro capturado no ApprovalsController findNotApproved: ',
        error,
      )
      throw error
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get('student')
  async findOneNotApproved(
    @Body() data: { personId: number; userId: number },
  ): Promise<ICompleteStudent | null> {
    try {
      const completeStudent = await this.approvalsService.findOneNotApproved(
        data,
      )
      return completeStudent
    } catch (error) {
      console.error(
        'Erro capturado no ApprovalsController findOneNotApproved: ',
        error,
      )
      throw error
    }
  }
}
