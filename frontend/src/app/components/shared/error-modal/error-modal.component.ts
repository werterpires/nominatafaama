import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ErrorServices } from '../shared.service.ts/error.service'

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
})
export class ErrorModalComponent implements OnInit {
  constructor(private errorService: ErrorServices) {}
  errorMessage = ''
  // @Output() closeEvent = new EventEmitter<void>()

  ngOnInit(): void {
    this.errorService.errorMessage$.subscribe(
      (errorMessage) => (this.errorMessage = errorMessage),
    )
  }

  closeError() {
    // this.closeEvent.emit()
    this.errorService.closeError()
  }
}
