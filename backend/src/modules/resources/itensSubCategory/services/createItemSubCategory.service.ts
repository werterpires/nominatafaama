import { Injectable } from '@nestjs/common';
import { CreateItemSubCategoryDto } from '../dto/createItemCategoryDto';
import { ItensSubCategoryModel } from '../model/itensSubCategory.model';

@Injectable()
export class CreateItemSubCategoryService {
  constructor(private readonly itensSubCategoryModel: ItensSubCategoryModel) { }

  async createItemSubCategory({
    subCategoryName,
    subCategoryDescription,
    categoryId
  }: CreateItemSubCategoryDto) {
    const itemSubCategory = await this.itensSubCategoryModel.createItemSubCategory({
      subCategoryName,
      subCategoryDescription,
      categoryId
    });
    return itemSubCategory;
  }
}
