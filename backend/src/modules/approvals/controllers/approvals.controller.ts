import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get()
  async findNotApproved(): Promise<ICompleteUser[] | null> {
    try {
      const users = await this.approvalsService.findNotApproved()
      return users
    } catch (error) {
      console.error(
        'Erro capturado no ApprovalsController findNotApproved: ',
        error
      )
      throw error
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Get(':userId')
  async findOneNotApproved(
    @Param('userId') userId,
  ): Promise<ICompleteStudent | null> {
    try {
      userId= parseInt(userId.toString())
      const completeStudent = await this.approvalsService.findOneNotApproved(
        userId
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

  @Roles(ERoles.ADMINISTRACAO, ERoles.DOCENTE, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Put(':table')
  async approveAny(@Param('table') table:string, @Body() data: {id: number, approve:boolean}){
    try {
      
      const approved = await this.approvalsService.approveAny({id:data.id, approve:data.approve, table:table})
    } catch (error) {
      console.error(`Erro capturado no ApprovalsController approveAny: ${error}`) 
      throw error
    }
    
  }


}
