import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateItemSubCategory, IItemSubCategory } from '../types';

@Injectable()
export class ItensSubCategoryModel {
  constructor(@InjectModel() private readonly knex: Knex) { }

  async findAllItensSubCategory() {
    const allItensSubCategory: IItemSubCategory[] = await this.knex
    .table('itens_subcategory as isc')
    .leftJoin('itens_category as ic', 'isc.category_id', 'ic.category_id')
    console.log(allItensSubCategory )
    return allItensSubCategory;
  }

  async createItemSubCategory({
    subCategoryName,
    subCategoryDescription,
    categoryId
  }: ICreateItemSubCategory) {
    const itemSubCategory: IItemSubCategory = await this.knex
      .table('itens_subcategory')
      .insert({
        subcategory_name: subCategoryName,
        subCategory_description: subCategoryDescription,
        category_id: categoryId
      });

    return itemSubCategory;
  }
}
