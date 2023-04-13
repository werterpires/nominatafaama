export interface IItemSubCategory {
  subcategory_id: number;
  subcategory_name: string;
  subcategory_description: string;
  category_id:number;
  category_name: string;
  category_description: string;
}

export interface ICreateItemSubCategory {
  subCategoryName: string;
  subCategoryDescription: string;
  categoryId:number;
}