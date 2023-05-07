import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/fz_decorators/roles.decorator';
import { CreatePersonDto } from '../az_dto/createPeopleDto';
import { PeopleServices } from '../dz_services/people.service';
import { UpdatePersonDto } from '../az_dto/updatePeopleDto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleServices: PeopleServices) {}

  @Roles(ERoles.SECRETARIA, ERoles.ADMINISTRACAO)
  @Post()
  async createPerson(@Body() input: CreatePersonDto) {
    return await this.peopleServices.createPerson(input);
  }

  @Roles(ERoles.DIRECAO, ERoles.SECRETARIA, ERoles.ADMINISTRACAO)
  @Get(':id')
  async findPersonById(@Param('id') id: string) {
    return await this.peopleServices.findPersonById(id);
  }

  @Roles(ERoles.DIRECAO, ERoles.SECRETARIA, ERoles.ADMINISTRACAO)
  @Get()
  async findAllPeople() {
    return await this.peopleServices.findAllPeople();
  }

  @Roles(ERoles.SECRETARIA, ERoles.ADMINISTRACAO)
  @Put()
  async updatePerson(@Body() input: UpdatePersonDto) {
    return await this.peopleServices.updatePersonById(input);
  }
}
