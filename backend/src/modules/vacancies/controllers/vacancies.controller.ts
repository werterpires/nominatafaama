import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { VacanciesService } from '../services/vacancies.service';
import {
  CreateDirectVacancyDto,
  CreateVacancyDto,
} from '../dto/create-vacancy.dto';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { ERoles } from 'src/shared/auth/types/roles.enum';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Roles(ERoles.ADMINISTRACAO, ERoles.SECRETARIA, ERoles.DIRECAO)
  @Post()
  async createDirectVacancy(@Body() createVacancyDto: CreateDirectVacancyDto) {
    try {
      const newVacancy = await this.vacanciesService.createDirectVacancy(
        createVacancyDto
      );
      return newVacancy;
    } catch (error) {
      console.error(
        'erro capturado em createDirectVacancy em Vacanciescontroller'
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(+id, updateVacancyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(+id);
  }
}
