import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs'
import { ILoginDto } from '../../login/login.Dto'
import { IUserApproved } from '../container/types'

@Injectable({ providedIn: 'root' })
export class LoginService {
  private user = new BehaviorSubject<IUserApproved | null>(null)
  user$ = this.user.asObservable()
  userToken!: string

  constructor(private http: HttpClient, private router: Router) {
    this.loginCheck()
  }

  loginCheck() {
    const token = localStorage.getItem('access_token')
    if (token) {
      this.userToken = token
      this.getRoles(token)
    }
  }

  logout() {
    localStorage.removeItem('access_token')
    this.userToken = ''
    this.user.next(null)
  }

  login(loginData: ILoginDto) {
    return this.http
      .post<{ access_token: string }>('http://localhost:3000/login', loginData)
      .pipe(
        catchError((error) => {
          if ((error.statusText = 'Unauthorized')) {
            return throwError(
              () => new Error('Senha ou email não localizados.'),
            )
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
        tap((resposta) => {
          this.getRoles(resposta.access_token)
        }),
      )
  }

  getRoles(token: string) {
    if (token) {
      this.userToken = token
      localStorage.setItem('access_token', this.userToken)
      this.http
        .get<IUserApproved>('http://localhost:3000/users/roles', {
          headers: { Authorization: 'bearer ' + token },
        })
        .subscribe({
          next: (userApproved) => {
            if (userApproved.user_approved) {
              this.user.next(userApproved)
              this.router.navigateByUrl('/')
            } else throw Error('User not approved')
          },
          error: (error: HttpErrorResponse) => {
            console.error(error)
            if (error.status === 401) {
              this.logout()
            }
          },
        })
    }
  }
}
