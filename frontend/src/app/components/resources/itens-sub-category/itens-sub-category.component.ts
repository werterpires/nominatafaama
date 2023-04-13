import { Component, Input, SimpleChanges } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { ICreateItemSubCategory, IItemSubCategory } from '../types/itensSubCategory.types';
import { ICreate } from '../types/roles.types copy';

@Component({
  selector: 'app-itens-sub-category',
  templateUrl: './itens-sub-category.component.html',
  styleUrls: ['./itens-sub-category.component.css']
})
export class ItensSubCategoryComponent {

  constructor(
    private resourcesService: ResourcesService
  ) { }

  itensSubCategory!: IItemSubCategory[];
  newItemSubCategory: ICreateItemSubCategory = {
    subCategoryName: "",
    subCategoryDescription: "",
    categoryId: 0
  }

  creatingItemSubCategory: ICreate = {
    active: false
  }

  @Input()methodIdx!: Number

  ngOnChanges(changes: SimpleChanges) {
    if (changes['methodIdx'] && changes['methodIdx'].currentValue === 5) {
      this.resourcesService.findAllItensSubCategory().subscribe(itensSubCategory=>{
        this.itensSubCategory=itensSubCategory
      });
    }
  }

  createItemSubCategoryModal() {
    this.creatingItemSubCategory.active = true
  }

  destroyItemSubCategoryModal() {
    this.creatingItemSubCategory.active = false
  }

  createItemSubCategory(){
    this.resourcesService.createItemSubCategory(this.newItemSubCategory).subscribe(itemSubCategory => {

      alert(`A Subcategoria ${itemSubCategory} foi cadastrada`)

      this.creatingItemSubCategory.active = false
    })
  }

}
