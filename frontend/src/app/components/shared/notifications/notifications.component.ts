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

  constructor(private service: notificationsService) {}
  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null

  ngOnInit() {
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
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

  // editRegistry(index: number) {
  //   this.isLoading = true

  //   if (this.allRegistries[index].course_area.length < 2) {
  //     this.showError('Insira a área do curso para prosseguir com o registro')
  //     return
  //   }

  //   if (this.allRegistries[index].institution.length < 2) {
  //     this.showError('Insira a instituição para prosseguir com o registro')
  //     return
  //   }

  //   if (this.allRegistries[index].begin_date.length < 2) {
  //     this.showError(
  //       'Informe a data de início do curso para prosseguir com o registro',
  //     )
  //     return
  //   }

  //   const newRegistry: Partial<ICourse> = {
  //     ...this.allRegistries[index],
  //     begin_date: this.dataService.dateFormatter(
  //       this.allRegistries[index].begin_date,
  //     ),
  //     conclusion_date: this.allRegistries[index].conclusion_date
  //       ? this.dataService.dateFormatter(
  //           this.allRegistries[index].conclusion_date || '',
  //         )
  //       : null,
  //   }
  //   delete newRegistry.created_at
  //   delete newRegistry.updated_at
  //   delete newRegistry.course_approved
  //   this.service.updateRegistry(newRegistry as IUpdateCourse).subscribe({
  //     next: () => {
  //       this.doneMessage = 'Registro editado com sucesso.'
  //       this.done = true
  //       this.ngOnInit()
  //       this.isLoading = false
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.message
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

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
