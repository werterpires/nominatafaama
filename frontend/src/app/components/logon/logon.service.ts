import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ILogonDto } from './logon.Dto'

@Injectable({
  providedIn: 'root',
})
export class LogonService {
  constructor(private http: HttpClient, private router: Router) {}

  logon(logonData: ILogonDto) {
    return this.http.post(environment.API + '/users', logonData).pipe(
      catchError((error) => {
        if ((error.statusText = 'Unauthorized')) {
          console.log(`O erro verdadeiro foi esse:`, error)
          return throwError(() => new Error('Senha ou email não localizados.'))
        } else if ((error.name = 'HttpErrorResponse')) {
          return throwError(
            () => new Error('Não foi possível fazer contato com o servidor.'),
          )
        } else {
          return throwError(
            () => new Error('Aconteceu um problema com o seu login'),
          )
        }
      }),
    )
  }
}
