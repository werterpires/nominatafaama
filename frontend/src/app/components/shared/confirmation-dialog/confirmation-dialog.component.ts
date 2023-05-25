import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService } from '../shared.service.ts/dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  @Input() id!: number;
  @Input() title = 'Confirma?';
  @Input() text = ['Você confirma esta ação?'];
  @Output() confirmation = new EventEmitter<number>();

  constructor(public service: DialogService) {}

  cancel() {
    this.confirmation.emit(-1);
  }

  confirm() {
    this.confirmation.emit(this.id);
  }
}
