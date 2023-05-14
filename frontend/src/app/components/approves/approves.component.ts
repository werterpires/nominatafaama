import { Component, Input } from '@angular/core';
import { UsersServices } from '../shared/shared.service.ts/users.services';
import { IPermissions, IUser } from '../shared/container/types';

@Component({
  selector: 'app-approves',
  templateUrl: './approves.component.html',
  styleUrls: ['./approves.component.css']
})
export class ApprovesComponent {
  @Input() permissions!:IPermissions

  router: any;
  

  


}
