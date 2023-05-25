import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
})
export class RegistryComponent {
  @Input() registryId: any
  @Input() fieldChanged = false
  @Output() deleteRegistry = new EventEmitter<number>()
  @Output() editRegistry = new EventEmitter<{
    id: number
    saveButtonId: string
  }>()
}
