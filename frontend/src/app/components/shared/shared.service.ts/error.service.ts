import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

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
      default:
        return 'Não foi possível completar a ação.'
    }
  }
}
