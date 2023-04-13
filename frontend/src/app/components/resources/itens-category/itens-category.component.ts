import { Component, Input, SimpleChanges } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { ICreateItemCategory, IItemCategory } from '../types/itensCategory.types';
import { ICreate } from '../types/roles.types copy';

@Component({
  selector: 'app-itens-category',
  templateUrl: './itens-category.component.html',
  styleUrls: ['./itens-category.component.css']
})
export class ItensCategoryComponent {

  constructor(
    private resourcesService: ResourcesService
  ) { }

  itensCategory!: IItemCategory[];
  newitemCategory: ICreateItemCategory = {
    categoryName: "",
    categoryDescription: ""
  }

  creatingItemCategory: ICreate = {
    active: false
  }

  @Input()methodIdx!: Number

  ngOnChanges(changes: SimpleChanges) {
    if (changes['methodIdx'] && changes['methodIdx'].currentValue === 4) {
      this.resourcesService.findAllItensCategory().subscribe(itensCategory=>{
        this.itensCategory=itensCategory
      });
    }
  }

  createItemCategoryModal() {
    this.creatingItemCategory.active = true
  }

  destroyItemCategoryModal() {
    this.creatingItemCategory.active = false
  }

  createItemCategory(){
    this.resourcesService.createItemCategory(this.newitemCategory).subscribe(itemCategory => {

      alert(`A Categoria ${itemCategory} foi cadastrada`)

      this.creatingItemCategory.active = false
    })
  }

}
