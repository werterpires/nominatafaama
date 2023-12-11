import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { AlertServices } from './alert.service'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  constructor(private alertService: AlertServices) {}
  alertMessage = ''
  alert = false

  @Output() confirmEvent = new EventEmitter<{
    func: string
    index: number | null
  }>()
  func = ''
  index: number | null = null

  ngOnInit(): void {
    this.alertService.alertMessage$.subscribe(
      (alertMessage) => (this.alertMessage = alertMessage),
    )
    this.alertService.alert$.subscribe((alert) => (this.alert = alert))
    this.alertService.func$.subscribe((func) => (this.func = func))
    this.alertService.idx$.subscribe((index) => (this.index = index))
  }

  closeAlert() {
    this.alertService.closeAlert()
  }

  confirm() {
    this.confirmEvent.emit({
      func: this.func,
      index: this.index,
    })
    this.closeAlert()
  }
}
