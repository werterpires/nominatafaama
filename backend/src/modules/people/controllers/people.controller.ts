import { Body, Controller, Get, Post } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/decorators/roles.decorator';
import { CreatePersonDto } from '../dto/createPeopleDto';
import { CreatePersonService } from '../services/createPerson.service';
import { FindAllPeopleService } from '../services/findAllPeople.service';

@Controller('people')
export class PeopleController {
  constructor(
    private readonly findAllPeopleService: FindAllPeopleService,
    private readonly createPersonService: CreatePersonService,
  ) { }

  @Roles(
    ERoles.ADMINISTRADOR,
    ERoles.AGENTE_FINANCEIRO,
    ERoles.AGENTE_DE_COBRANÇA,
    ERoles.AGENTE_DE_COMPRAS,
    ERoles.AGENTE_DE_PAGAMENTOS,
    ERoles.AGENTE_DE_RH,
    ERoles.PROPRIETARIO,
    ERoles.VENDEDOR,
    ERoles.ALMOXARIFE,
  )
  @Get()
  async findAllPeople() {
    return await this.findAllPeopleService.findAllPeople();
  }

  @Roles(
    ERoles.ADMINISTRADOR,
    ERoles.AGENTE_FINANCEIRO,
    ERoles.AGENTE_DE_COMPRAS,
    ERoles.AGENTE_DE_RH,
    ERoles.PROPRIETARIO,
    ERoles.VENDEDOR,
  )
  @Post()
  async createPerson(@Body() input: CreatePersonDto) {
    console.log("cheuguei no controller")
    return await this.createPersonService.createPerson(input);
  }
}
