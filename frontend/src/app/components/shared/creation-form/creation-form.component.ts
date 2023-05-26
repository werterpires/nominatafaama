import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-creation-form',
  templateUrl: './creation-form.component.html',
  styleUrls: ['./creation-form.component.css'],
})
export class CreationFormComponent {
  @Output() save = new EventEmitter<boolean>()
}
