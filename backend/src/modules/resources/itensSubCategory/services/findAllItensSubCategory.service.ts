import { Injectable } from '@nestjs/common';
import { ItensSubCategoryModel } from '../model/itensSubCategory.model';

@Injectable()
export class FindAllItensSubCategoryService {
  constructor(private readonly itensSubCategoryModel: ItensSubCategoryModel) { }

  async findAllItensSubCategory() {
    const allItensSubCategory = await this.itensSubCategoryModel.findAllItensSubCategory();
    return allItensSubCategory;
  }
}
