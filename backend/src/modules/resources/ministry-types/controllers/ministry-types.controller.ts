import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { MinistryTypesService } from '../services/ministry-types.service';
import { CreateMinistryTypeDto } from '../dto/create-ministry-type.dto';
import { UpdateMinistryTypeDto } from '../dto/update-ministry-type.dto';

@Controller('ministry-types')
export class MinistryTypesController {
  constructor(private readonly ministryTypesService: MinistryTypesService) {}

  @Post()
  async createMinistryType(@Body() input: CreateMinistryTypeDto) {
    try {
      const ministryType = await this.ministryTypesService.createMinistryType(input);
      return ministryType;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async getMinistryTypeById(@Param('id') id: number) {
    try {
      const ministryType = await this.ministryTypesService.findMinistryTypeById(id);
      if (!ministryType) {
        throw new NotFoundException(`Ministry type with id ${id} not found.`);
      }
      return ministryType;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAllMinistryTypes() {
    try{
      return await this.ministryTypesService.findAllMinistryTypes();
    }catch(error){
      throw error
    }
    
  }

  @Put()
  async updateMinistryType(@Body() input: UpdateMinistryTypeDto) {
    try {
      const updatedMinistryType = await this.ministryTypesService.updateMinistryTypeById(input);
      return updatedMinistryType;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  async deleteMinistryType(@Param('id') id: number) {
    try {
      const message = await this.ministryTypesService.deleteMinistryTypeById(id);
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }



}

