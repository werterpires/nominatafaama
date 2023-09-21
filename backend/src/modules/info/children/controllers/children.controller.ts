import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/auth/decorators/current-user.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { UserFromJwt } from 'src/shared/auth/types/types';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { IChild } from '../types/types';
import { CreateChildDto } from '../dto/create-child.dto';
import { ChildrenService } from '../services/children.service';
import { UpdateChildDto } from '../dto/update-child.dto';

@Controller('children')
export class ChildrenController {
  constructor(private childrenService: ChildrenService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Post()
  async createChild(
    @Body() input: CreateChildDto,
    @CurrentUser() user: UserFromJwt
  ) {
    try {
      const { user_id } = user;
      const newChild = await this.childrenService.createChild(input, user_id);
      return newChild;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get()
  async findAllStudentChildren(
    @CurrentUser() user: UserFromJwt
  ): Promise<IChild[]> {
    try {
      const user_id = user.user_id;
      const children = await this.childrenService.findAllChildrenByStudentId(
        user_id
      );
      return children;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Get(':id')
  async findChildById(@Param('id') id: number): Promise<IChild> {
    try {
      const child = await this.childrenService.findChildById(id);
      if (!child) {
        throw new NotFoundException(`No child found with id ${id}.`);
      }
      return child;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO)
  @Get()
  async findAllChildren(): Promise<IChild[]> {
    try {
      const children = await this.childrenService.findAllChildren();
      return children;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Put()
  async updateChildById(@Body() input: UpdateChildDto): Promise<IChild> {
    try {
      console.log('aqui no controller');
      const updatedChild = await this.childrenService.updateChildById(input);
      return updatedChild;
    } catch (error) {
      console.error('Erro capturado no controller: ', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.ESTUDANTE)
  @Delete(':id')
  async deleteChildById(@Param('id') id: number) {
    try {
      const message = await this.childrenService.deleteChildById(id);
      return { message };
    } catch (error) {
      console.error('Erro capturado no controller: ', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
