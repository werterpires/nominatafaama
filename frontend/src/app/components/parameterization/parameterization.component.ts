import { Component, Input } from '@angular/core'
import { IPermissions } from '../shared/container/types'

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.css'],
})
export class ParameterizationComponent {
  @Input() permissions!: IPermissions
}
