import { Injectable } from '@nestjs/common';
import { ItensCategoryModel } from '../model/itensCategory.model';

@Injectable()
export class FindAllItensCategoryService {
  constructor(private readonly itensCategoryModel: ItensCategoryModel) { }

  async findAllItensCategory() {
    const allItensCategory = await this.itensCategoryModel.findAllItensCategory();
    return allItensCategory;
  }
}
