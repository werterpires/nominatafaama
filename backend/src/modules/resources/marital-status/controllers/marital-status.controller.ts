import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { MaritalStatusService } from '../services/marital-status.service';
import { CreateMaritalStatusDto } from '../dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from '../dto/update-marital-status.dto';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';

@Controller('marital-status')
export class MaritalStatusController {
  constructor(private readonly maritalStatusService: MaritalStatusService) {}
  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createMaritalStatus(@Body() input: CreateMaritalStatusDto) {
    try {
      const maritalStatus = await this.maritalStatusService.createMaritalStatus(input);
      return maritalStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async getMaritalStatusById(@Param('id') id: number) {
    try {
      const maritalStatus = await this.maritalStatusService.findMaritalStatusById(id);
      if (!maritalStatus) {
        throw new NotFoundException(`Marital status with id ${id} not found.`);
      }
      return maritalStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAllMaritalStatuses() {
    return await this.maritalStatusService.findAllMaritalStatuses();
  }

  @Put()
  async updateMaritalStatusById(id: number, @Body() input: UpdateMaritalStatusDto) {
    try {
      const updatedMaritalStatus = await this.maritalStatusService.updateMaritalStatusById(input);
      return updatedMaritalStatus;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  async deleteMaritalStatusById(@Param('id') id: number) {
    try {
      const message = await this.maritalStatusService.deleteMaritalStatusById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
