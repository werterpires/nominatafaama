export interface IItemSubCategory {
  subCategory_id: number;
  subCategory_name: string;
  subCategory_description: string;
  category_id: number;
  category_name: string;
  cateroy_description: string;
}

export interface ICreateItemSubCategory {
  subCategoryName: string;
  subCategoryDescription: string;
  categoryId: number
}
