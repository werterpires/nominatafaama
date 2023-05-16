import { Component, Input } from '@angular/core';
import { IPermissions } from '../shared/container/types';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent {

  @Input() permissions!: IPermissions

}
