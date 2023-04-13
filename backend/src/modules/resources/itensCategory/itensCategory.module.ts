import { Module } from '@nestjs/common';
import { ItensCategoryController } from './controllers/itensCategory.controller';
import { FindAllItensCategoryService } from './services/findAllItensCategory.service';
import { ItensCategoryModel } from './model/itensCategory.model';
import { CreateItemCategoryService } from './services/createItemCategory.service';

const services = [
  FindAllItensCategoryService,
  ItensCategoryModel,
  CreateItemCategoryService,
];

@Module({
  imports: [],
  controllers: [ItensCategoryController],
  providers: services,
  exports: services,
})
export class ItensCategoryModule { }
