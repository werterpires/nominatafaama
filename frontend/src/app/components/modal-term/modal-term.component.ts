import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ITerm } from '../logon/types/logon.types'

@Component({
  selector: 'app-modal-term',
  templateUrl: './modal-term.component.html',
  styleUrls: ['./modal-term.component.css'],
})
export class ModalTermComponent {
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Input() userTerms: ITerm[] = []
  accept = false

  confirmLogon(confirm: boolean) {
    this.confirm.emit(confirm)
  }
}
