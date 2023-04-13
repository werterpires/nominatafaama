import { Body, Controller, Get, Post } from '@nestjs/common';
import { ERoles } from 'src/shared/auth/types/roles.enum';
import { Roles } from 'src/shared/roles/decorators/roles.decorator';
import { CreateItemSubCategoryDto } from '../dto/createItemCategoryDto';
import { CreateItemSubCategoryService } from '../services/createItemSubCategory.service';
import { FindAllItensSubCategoryService } from '../services/findAllItensSubCategory.service';

// Declara o controller "AddressesController" (Controlador de endereços) e atribui a rota "/addresses"
@Controller('itensSubCategory')
export class ItensSubCategoryController {
  constructor(
    // Injeta o serviço "FindAllAddressesService" (Serviço para encontrar todos os endereços)
    private readonly findAllItensSubCategoryService: FindAllItensSubCategoryService,
    // Injeta o serviço "CreateItemCategoryService" (Serviço para criar um endereço)
    private readonly createItemSubCategoryService: CreateItemSubCategoryService,
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
    ERoles.AGENTE_DE_PATRIMONIO,
    ERoles.ALMOXARIFE,
  )
  @Get()
  async findAllItensSubCategory() {
   
    return await this.findAllItensSubCategoryService.findAllItensSubCategory();
  }


  @Roles(
    ERoles.ADMINISTRADOR,
    ERoles.AGENTE_FINANCEIRO,
    ERoles.AGENTE_DE_COMPRAS,
    ERoles.AGENTE_DE_PAGAMENTOS,
  )
  @Post()
  async createItemSubCategory(@Body() input: CreateItemSubCategoryDto) {
    
    return await this.createItemSubCategoryService.createItemSubCategory(input);
  }
}
