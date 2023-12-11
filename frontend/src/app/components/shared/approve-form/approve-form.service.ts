import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ApproveFormServices {
  constructor(private http: HttpClient, private router: Router) {}

  private approveAllSubject = new BehaviorSubject<void>(undefined)
  private activeApproveFormsNumber = 0
  private concluedApprovesNumber = 0
  private atualizeStudent$ = new Subject<void>()

  addForm(): void {
    this.activeApproveFormsNumber += 1
    console.log('forms ativos:', this.activeApproveFormsNumber)
  }

  removeForm(): void {
    this.activeApproveFormsNumber -= 1
    console.log('forms ativos:', this.activeApproveFormsNumber)
  }

  finishApprove(): void {
    this.concluedApprovesNumber += 1
    console.log('forms concluídos:', this.concluedApprovesNumber)

    if (this.concluedApprovesNumber === this.activeApproveFormsNumber) {
      this.atualizeStudent$.next()
      this.concluedApprovesNumber = 0
      console.log(
        'Salvou tudo: forms concluídos:',
        this.concluedApprovesNumber,
        'forms ativos:',
        this.activeApproveFormsNumber,
      )
    }
  }

  atualizeStudentObservable() {
    return this.atualizeStudent$.asObservable()
  }

  approveAll$ = this.approveAllSubject.asObservable()

  approveAll(): void {
    this.approveAllSubject.next()
  }
}
