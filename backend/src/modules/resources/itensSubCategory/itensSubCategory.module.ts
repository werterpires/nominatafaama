import { Module } from '@nestjs/common';
import { ItensSubCategoryController } from './controllers/itensCategory.controller';
import { FindAllItensSubCategoryService } from './services/findAllItensSubCategory.service';
import { ItensSubCategoryModel } from './model/itensSubCategory.model';
import { CreateItemSubCategoryService } from './services/createItemSubCategory.service';

const services = [
  FindAllItensSubCategoryService,
  ItensSubCategoryModel,
  CreateItemSubCategoryService,
];

@Module({
  imports: [],
  controllers: [ItensSubCategoryController],
  providers: services,
  exports: services,
})
export class ItensSubCategoryModule { }
