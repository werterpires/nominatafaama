import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
})
export class AlertModalComponent {
  @Output() continue = new EventEmitter<{ confirm: boolean; func: string }>()
  @Input() alertMessage = ''
  @Input() func = ''

  confirm(confirm: boolean) {
    this.continue.emit({ confirm: confirm, func: this.func })
  }
}
