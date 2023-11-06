import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../container/types'
import { IUserNotification } from './types'
import { notificationsService } from './notifications.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  @Input() permissions!: IPermissions

  allNotifications: IUserNotification[] = []

  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''
  read = false

  constructor(private service: notificationsService) {}
  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null

  ngOnInit() {
    this.getAllRegistries(false)
  }

  getAllRegistries(read: boolean) {
    this.isLoading = true
    this.read = read
    this.service.findAllRegistries(read).subscribe({
      next: (res) => {
        this.allNotifications = res
        console.log(this.allNotifications)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
  setReadToAll() {
    this.allNotifications.forEach((notification) => {
      this.setRead(notification.user_notification_id)
    })
  }

  setRead(index: number) {
    this.isLoading = true

    const notificationId = { notificationId: index }

    this.service.setRead(notificationId).subscribe({
      next: () => {
        this.allNotifications = this.allNotifications.filter(
          (notification) => notification.user_notification_id !== index,
        )
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  // deleteRegistry(id: number) {
  //   this.isLoading = true
  //   this.service.deleteRegistry(id).subscribe({
  //     next: () => {
  //       this.doneMessage = 'Registro removido com sucesso.'
  //       this.done = true
  //       this.isLoading = false
  //       this.ngOnInit()
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.message
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
