import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ICreateItemCategory, IItemCategory } from '../types';

@Injectable()
export class ItensCategoryModel {
  constructor(@InjectModel() private readonly knex: Knex) { }

  async findAllItensCategory() {
    const allItensCategory: IItemCategory[] = await this.knex.table(
      'itens_category as ic',
    );

    return allItensCategory;
  }

  async createItemCategory({
    categoryName,
    categoryDescription,
  }: ICreateItemCategory) {
    const itemCategory: IItemCategory = await this.knex
      .table('itens_category')
      .insert({
        category_name: categoryName,
        category_description: categoryDescription,
      });

    return itemCategory;
  }
}
