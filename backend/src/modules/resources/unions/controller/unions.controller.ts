import { Controller, Get, Post, Body, Param, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { UnionsService } from '../services/unions.service';
import { CreateUnionDto } from '../dto/create-union.dto';
import { UpdateUnionDto } from '../dto/update-union.dto';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { IsPublic } from 'src/shared/auth/decorators/is-public.decorator';

@Controller('unions')
export class UnionsController {
  constructor(private readonly unionsService: UnionsService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Post()
  async createUnion(@Body() input: CreateUnionDto) {
    try {
      const union = await this.unionsService.createUnion(input);
      return union;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Get(':id')
  async getUnionById(@Param('id') id: number) {
    try {
      const union = await this.unionsService.findUnionById(id);
      if (!union) {
        throw new NotFoundException(`Union with id ${id} not found.`);
      }
      return union;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @IsPublic()
  @Get()
  async findAllUnions() {
    return await this.unionsService.findAllUnions();
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Put()
  async updateUnion(@Body() input: UpdateUnionDto) {
    try {
      const updatedUnion = await this.unionsService.updateUnionById(input);
      return updatedUnion;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA)
  @Delete(':id')
  async deleteUnionById(@Param('id') id: number) {
    try {
      const message = await this.unionsService.deleteUnionById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
