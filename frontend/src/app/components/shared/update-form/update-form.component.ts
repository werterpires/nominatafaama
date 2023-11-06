import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css'],
})
export class UpdateFormComponent {
  @Input() registryId: any
  @Input() fieldChanged = false
  @Input() del = true
  @Output() deleteRegistry = new EventEmitter<number>()
  @Output() editRegistry = new EventEmitter<{
    id: number
    saveButtonId: string
  }>()
}
