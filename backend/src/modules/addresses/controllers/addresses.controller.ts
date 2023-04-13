import { Body, Controller, Get, Post } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/decorators/roles.decorator';
import { CreateAddressDto } from '../dto/createAddressDto';
import { CreateAddresseservice } from '../services/createAddress.service';
import { FindAllAddressesService } from '../services/findAllAddresses.service';

// Declara o controller "AddressesController" (Controlador de endereços) e atribui a rota "/addresses"
@Controller('addresses')
export class AddressesController {
  constructor(
    // Injeta o serviço "FindAllAddressesService" (Serviço para encontrar todos os endereços)
    private readonly findAllAddressesService: FindAllAddressesService,
    // Injeta o serviço "CreateAddresseservice" (Serviço para criar um endereço)
    private readonly createAddresseservice: CreateAddresseservice,
  ) { }

  // Mapeia a rota "/addresses" com o método HTTP "GET" e o método "findAllAddresses" (Encontrar todos os endereços)
  @Roles(
    ERoles.ADMINISTRADOR,
    ERoles.AGENTE_FINANCEIRO,
    ERoles.AGENTE_DE_COBRANÇA,
    ERoles.AGENTE_DE_COMPRAS,
    ERoles.AGENTE_DE_PAGAMENTOS,
    ERoles.AGENTE_DE_RH,
    ERoles.PROPRIETARIO,
    ERoles.VENDEDOR,
  )
  @Get()
  async findAllAddresses() {
    // Retorna o resultado da chamada ao método "findAllAddresses" (Encontrar todos os endereços) do serviço "FindAllAddressesService" (Serviço para encontrar todos os endereços)
    return await this.findAllAddressesService.findAllAddresses();
  }

  // Mapeia a rota "/addresses" com o método HTTP "POST" e o método "createAddress" (Criar um endereço)
  @Roles(
    ERoles.ADMINISTRADOR,
    ERoles.AGENTE_FINANCEIRO,
    ERoles.AGENTE_DE_COBRANÇA,
    ERoles.AGENTE_DE_COMPRAS,
    ERoles.AGENTE_DE_PAGAMENTOS,
    ERoles.AGENTE_DE_RH,
    ERoles.VENDEDOR,
  )
  @Post()
  async createAddress(@Body() input: CreateAddressDto) {
    // Retorna o resultado da chamada ao método "createAddress" (Criar um endereço) do serviço "CreateAddresseservice" (Serviço para criar um endereço)
    return await this.createAddresseservice.createAddress(input);
  }
}
