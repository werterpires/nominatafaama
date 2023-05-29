import { Component, Input } from '@angular/core'
import { IPermissions } from '../shared/container/types'
import { DataService } from '../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  @Input() permissions!: IPermissions

  constructor(public dataService: DataService) {}
}
