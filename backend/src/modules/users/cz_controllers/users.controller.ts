import {
  Body,
  ConsoleLogger,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards
} from '@nestjs/common'
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator'
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator'
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator'
import { ERoles } from 'src/shared/auth/types/roles.enum'
import { CreateUserDto } from '../az_dto/createUserDto'
import { UsersService } from '../dz_services/users.service'
import { IAproveUser, IUpdateUser, IUser } from '../bz_types/types'
import { AuthRequest, UserFromJwt } from 'src/shared/auth/types/types'
import { RestrictRoles } from 'src/shared/roles/fz_decorators/restrictRoles.decorator'
import { UsersGuard } from '../gz_guards/users.guard'
import { AproveUserDto } from '../az_dto/aproveUserDto'
import { UpdateUserDto } from '../az_dto/updateUserDto'
import { CreateRecoverPassDto } from '../az_dto/createRecoverPassDto'
import { CompareRecoverPassDto } from '../az_dto/compareRecoverPassDto'
import { UsersToApproveService } from '../dz_services/usersToApprove.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersToApproveService: UsersToApproveService
  ) {}

  @IsPublic()
  @Post()
  async createUser(@Body() input: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(input)
      return user
    } catch (error) {
      console.error('erro no controller', error)
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.DIRECAO,
    ERoles.MINISTERIAL,
    ERoles.SECRETARIA
  )
  @Get('usersToApprove/:requiredRole/:status')
  async findUsersToApprove(
    @Param('requiredRole') requiredRole: string,
    @Param('status') status: string,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const usersToapprove =
        await this.usersToApproveService.findUsersToApprove(
          currentUser,
          requiredRole,
          status
        )

      return usersToapprove
    } catch (error) {
      console.log('Erro no controller, findUsersToApprove:', error)
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @RestrictRoles(ERoles.ESTUDANTE)
  @Get('find/:id')
  async getUserById(@Param('id') id: number) {
    try {
      const user = await this.usersService.findUserById(id)

      return user
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.DIRECAO,
    ERoles.DOCENTE,
    ERoles.ESTUDANTE,
    ERoles.REPRESENTACAO,
    ERoles.SECRETARIA,
    ERoles.MINISTERIAL,
    ERoles.DESIGN
  )
  @Get('edit')
  async getOwnUserById(@CurrentUser() currentUser: UserFromJwt) {
    try {
      const { user_id } = currentUser

      const user = await this.usersService.findUserById(user_id)

      return user
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @IsPublic()
  @Post('recover')
  async recoverPass(@Body() userEmail: CreateRecoverPassDto) {
    try {
      const email = userEmail.principalEmail
      const code = await this.usersService.recoverPass(email)

      return code
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @IsPublic()
  @Post('pass')
  async comparePasscode(@Body() data: CompareRecoverPassDto) {
    try {
      const email = data.principalEmail
      const pass = data.passCode
      const isValid = await this.usersService.comparePassCode(email, pass)

      return isValid
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @IsPublic()
  @Post('change')
  async changePassword(@Body() data: CompareRecoverPassDto) {
    try {
      const email = data.principalEmail
      const password = data.passCode
      const isValid = await this.usersService.changewPassword(email, password)

      return isValid
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get('roles')
  async getUserRoles(@CurrentUser() currentUser: IUser) {
    try {
      if (!currentUser) {
        throw new Error('No user')
      }
      let terms = await this.usersService.findNotSignedTerms(currentUser)
      const user = {
        roles: currentUser.roles,
        user_approved: currentUser.user_approved,
        terms: terms
      }
      return user
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.DIRECAO,
    ERoles.SECRETARIA,
    ERoles.MINISTERIAL
  )
  @Get()
  async findAllUsers() {
    return await this.usersService.findAllUsers()
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.SECRETARIA,
    ERoles.DIRECAO,
    ERoles.MINISTERIAL
  )
  @UseGuards(UsersGuard)
  @Put('approve')
  async aproveUserById(
    @Body() input: AproveUserDto,
    @CurrentUser() currentUser: UserFromJwt
  ) {
    try {
      const approvedUser = await this.usersService.approveUserById(
        input,
        currentUser
      )
      return approvedUser
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.DIRECAO,
    ERoles.DOCENTE,
    ERoles.ESTUDANTE,
    ERoles.REPRESENTACAO,
    ERoles.SECRETARIA,
    ERoles.DESIGN,
    ERoles.MINISTERIAL
  )
  @Put('update')
  async updateUserById(
    @Body() input: UpdateUserDto,
    @CurrentUser() user: IUser
  ) {
    try {
      const id = user.user_id
      const updatedUser = await this.usersService.updateUserById(id, input)
      return updatedUser
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Roles(
    ERoles.ADMINISTRACAO,
    ERoles.DIRECAO,
    ERoles.DOCENTE,
    ERoles.ESTUDANTE,
    ERoles.REPRESENTACAO,
    ERoles.SECRETARIA
  )
  @Delete()
  async deleteUserById(@CurrentUser() user: IUser) {
    try {
      const id = user.user_id
      const message = await this.usersService.deleteUserById(id)
      return { message }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
