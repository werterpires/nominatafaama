import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ErrorServices {
  constructor(private http: HttpClient, private router: Router) {}

  makeErrorMessage(error: string) {
    switch (error) {
      case 'representations not found':
        return 'É necessário informar o campo que vc representa e que papel desempenha lá. Você faz isso na Aba "Cadastros".'
        break
      case 'active representation not found':
        return 'Você não possui uma representação de campo ativa. \n Pode ser que ela não tenha sido aprovada ainda ou a data de expiração tenha passado. \n\n Entre em contato com a coordenação do Salt para mais informações.'
        break
      case 'there is no correspondense between vacancy and representation':
        return 'Não é possível completar a ação porque essa vaga não é do campo que você representa hoje.'
        break
      case 'Vacancy has open invites':
        return 'Não é possível completar a ação porque essa vaga possui convites em aberto.'
        break
      case 'date is less than 7 days from now':
        return 'É necessário dar pelo menos 7 dias de prazo.'
        break
      case 'vacancy already approved':
        return 'Não é possível completar essa ação porque a vaga já possui pelo menos um convite aprovado pela coordenação.'
        break
      default:
        return 'Não foi possível completar a ação.'
    }
  }

  private errorSubject = new BehaviorSubject<boolean>(false)
  private errorMessageSubject = new BehaviorSubject<string>('')

  error$ = this.errorSubject.asObservable()
  errorMessage$ = this.errorMessageSubject.asObservable()

  showError(message: string): void {
    this.errorSubject.next(true)
    this.errorMessageSubject.next(message)
  }

  closeError(): void {
    this.errorSubject.next(false)
    this.errorMessageSubject.next('')
  }
}
