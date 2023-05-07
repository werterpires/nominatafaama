import { Component, Input, OnInit, Output, ɵgetDebugNodeR2 } from '@angular/core';
import { ResourcesService } from './resources.service';
import { IAddress, ICreateAddress } from './types/adresses.types';
import { IMenuOptions } from '../shared/main-content/types/main-content.types';
import { MainContentService } from '../shared/main-content/main-content.service';
import { resourcesMenuOptions } from './entities/menuOptions';
import { ICreatePerson, IPerson } from './types/people.types';
import { IUser } from './types/users.types';
import { IRole } from './types/roles.types';
import { IItemCategory } from './types/itensCategory.types';
import { ICreate } from './types/roles.types copy';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent {
  constructor(
    private resourcesService: ResourcesService
  ) { }

  addresses!: IAddress[];
  people!: IPerson[];
  itensCategory!: IItemCategory[];

  methodIdx!:number

  menuOptions: IMenuOptions[] = resourcesMenuOptions

  getNewOptions(newOptions: IMenuOptions[]) {
    this.menuOptions = newOptions

    let option: IMenuOptions

    newOptions.forEach(opt => {
      if (opt.active === true) {
        option = opt
      }
      this.methodIdx = newOptions.indexOf(option)

      if (this.methodIdx == 0) {
        this.findAllAddresses()
      } else if (this.methodIdx == 1) {
        this.findAllPeople()
      } else if (this.methodIdx == 2) {
      } else if (this.methodIdx == 3) {
      } else if (this.methodIdx == 4) {
        this.findAllItensCategory()
      }

    })

  }

  findAllAddresses() {

    this.resourcesService.findAllAddresses().subscribe(addresses => {

      this.addresses = addresses
    });
  }

  findAllPeople() {

    this.resourcesService.findAllPeople().subscribe(people => {

      this.people = people
    });
  }

  

  findAllItensCategory() {

    this.resourcesService.findAllItensCategory().subscribe(itensCategory => {
      this.itensCategory = itensCategory
    });
  }

}


