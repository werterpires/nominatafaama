import { Injectable } from '@nestjs/common';
import { CreateItemCategoryDto } from '../dto/createItemCategoryDto';
import { ItensCategoryModel } from '../model/itensCategory.model';

@Injectable()
export class CreateItemCategoryService {
  constructor(private readonly itensCategoryModel: ItensCategoryModel) { }

  async createItemCategory({
    categoryName,
    categoryDescription,
  }: CreateItemCategoryDto) {
    const itemCategory = await this.itensCategoryModel.createItemCategory({
      categoryName,
      categoryDescription,
    });
    return itemCategory;
  }
}
