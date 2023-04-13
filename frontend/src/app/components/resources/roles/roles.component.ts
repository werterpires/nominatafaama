import { Component, Input, SimpleChanges } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { IRole } from '../types/roles.types';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  constructor(
    private resourcesService: ResourcesService
  ) { }

  roles!:IRole[];


  @Input()methodIdx!: Number

  ngOnChanges(changes: SimpleChanges) {
    if (changes['methodIdx'] && changes['methodIdx'].currentValue === 3) {
      this.resourcesService.findAllRoles().subscribe(roles=>{
        this.roles=roles
      });
    }
  }

  findAllRoles() {

    this.resourcesService.findAllRoles().subscribe(roles => {

      this.roles = roles
    });
  }

}
