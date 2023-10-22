import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ILogonDto } from './logon.Dto'
import { ITerm } from './types/logon.types'

@Injectable({
  providedIn: 'root',
})
export class LogonService {
  constructor(private http: HttpClient, private router: Router) {}

  logon(logonData: ILogonDto) {
    return this.http.post(environment.API + '/users', logonData).pipe(
      catchError((error) => {
        console.log(error)
        if (error.statusText == 'Unauthorized') {
          console.log(`O erro verdadeiro foi esse:`, error)
          return throwError(() => new Error('Senha ou email não localizados.'))
        } else if (error.name == 'HttpErrorResponse') {
          return throwError(() => new Error(error.error.message))
        } else {
          return throwError(
            () => new Error('Aconteceu um problema com o seu login'),
          )
        }
      }),
    )
  }

  findAllRegistries(): Observable<ITerm[]> {
    return this.http.get<ITerm[]>(environment.API + '/terms/active/').pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error)
        return throwError(
          () =>
            new Error(
              'Não foi possível encontrar os termos ativos cadastrados.',
            ),
        )
      }),
    )
  }
}
