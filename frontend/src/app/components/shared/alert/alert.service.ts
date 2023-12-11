import { HttpClient } from '@angular/common/http'
import { EventEmitter, Injectable, Output } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AlertServices {
  constructor(private http: HttpClient, private router: Router) {}

  private alertSubject = new BehaviorSubject<boolean>(false)
  private alertMessageSubject = new BehaviorSubject<string>('')
  private funcSubject = new BehaviorSubject<string>('')
  private idxSubject = new BehaviorSubject<number | null>(null)

  alert$ = this.alertSubject.asObservable()
  alertMessage$ = this.alertMessageSubject.asObservable()
  func$ = this.funcSubject.asObservable()
  idx$ = this.idxSubject.asObservable()

  showAlert(message: string, func: string, index: number | null): void {
    this.alertSubject.next(true)
    this.funcSubject.next(func)
    this.idxSubject.next(index)
    this.alertMessageSubject.next(message)
  }

  closeAlert(): void {
    this.alertSubject.next(false)
    this.alertMessageSubject.next('')
    this.funcSubject.next('')
    this.idxSubject.next(null)
  }
}
