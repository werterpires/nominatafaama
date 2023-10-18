import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  BehaviorSubject,
  Observable,
  catchError,
  switchMap,
  tap,
  throwError,
} from 'rxjs'
import { ILoginDto } from '../../login/login.Dto'
import { IUserApproved } from '../container/types'
import { environment } from 'src/environments/environment'
import { ITerm } from '../../logon/types/logon.types'
import { ItermUser } from '../../logon/logon.Dto'

@Injectable({ providedIn: 'root' })
export class LoginService {
  private user = new BehaviorSubject<IUserApproved | null | string>('wait')
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
    } else {
      this.user.next(null)
    }
  }

  logout() {
    localStorage.removeItem('access_token')
    this.userToken = ''
    this.user.next(null)
  }

  // login(loginData: ILoginDto) {
  //   return this.http
  //     .post<{ access_token: string }>(environment.API + '/login', loginData)
  //     .pipe(
  //       switchMap((res) => {
  //         this.userToken = res.access_token
  //         localStorage.setItem('access_token', this.userToken)
  //         this.http
  //           .get<IUserApproved>(environment.API + '/users/roles', {
  //             headers: { Authorization: 'bearer ' + res.access_token },
  //           })
  //           .subscribe({
  //             next: (userApproved) => {
  //               if (userApproved.user_approved) {
  //                 this.user.next(userApproved)
  //                 this.router.navigateByUrl('/')
  //               } else throw Error('User not approved')
  //             },
  //             error: (error: HttpErrorResponse) => {
  //               console.error(error)
  //               if (error.status === 401) {
  //                 this.logout()
  //               }
  //             },
  //           })
  //       }),
  //       catchError((error) => {
  //         if (error.statusText == 'Unauthorized') {
  //           return throwError(
  //             () => new Error('Senha ou email não localizados.'),
  //           )
  //         } else if (error.name == 'HttpErrorResponse') {
  //           return throwError(
  //             () => new Error('Não foi possível fazer contato com o servidor.'),
  //           )
  //         } else {
  //           return throwError(
  //             () => new Error('Aconteceu um problema com o seu login'),
  //           )
  //         }
  //       }),
  //       // ,
  //       // tap((resposta) => {
  //       //   this.getRoles(resposta.access_token)
  //       // }),
  //     )
  // }

  login(loginData: ILoginDto) {
    return this.http
      .post<{ access_token: string }>(environment.API + '/login', loginData)
      .pipe(
        // switchMap((res) => {
        //   // this.userToken = res.access_token
        //   // localStorage.setItem('access_token', this.userToken)
        //   // console.log('token recebido:', this.userToken)

        // }),
        catchError((error) => {
          console.log('O erro que chegou foi:', error)
          if (error.error.message === 'Estudante inativo') {
            return throwError(
              () =>
                new Error(
                  'Apenas estudantes com matrícula ativa podem fazer login. Entre em contato com a coordenação para mais informações.',
                ),
            )
          }
          if (error.statusText === 'Unauthorized') {
            return throwError(
              () => new Error('Senha ou email não localizados.'),
            )
          } else if (error.name === 'HttpErrorResponse') {
            return throwError(
              () => new Error('Não foi possível fazer contato com o servidor.'),
            )
          } else {
            return throwError(
              () => new Error('Aconteceu um problema com o seu login'),
            )
          }
        }),
        // tap((userApproved) => {
        //   if (userApproved && userApproved.user_approved) {
        //     if (
        //       userApproved.terms &&
        //       userApproved.terms != null &&
        //       userApproved.terms.length > 0
        //     ) {
        //       return userApproved.terms
        //     } else {
        //       this.user.next(userApproved)
        //       this.router.navigateByUrl('/')
        //     }
        //   } else {
        //     throw Error(
        //       'Seu usuário ainda não foi aprovado pela equipe da coordenação.',
        //     )
        //   }
        // }),
      )
  }

  findApprovedUser(access_token: string) {
    return this.http
      .get<IUserApproved>(environment.API + '/users/roles', {
        headers: { Authorization: 'Bearer ' + access_token },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          if (error.status === 401) {
            this.logout()
          }
          return throwError(() => {
            if (error.statusText === 'Unauthorized') {
              return new Error('Senha ou email não localizados.')
            } else {
              return new Error('Não foi possível fazer contato com o servidor.')
            }
          })
        }),
      )
  }

  // getUserApproved(userApproved: IUserApproved) {
  //   if (userApproved && userApproved.user_approved) {
  //     if (
  //       userApproved.terms &&
  //       userApproved.terms != null &&
  //       userApproved.terms.length > 0
  //     ) {
  //       return userApproved.terms
  //     } else {
  //       this.user.next(userApproved)
  //       this.router.navigateByUrl('/')
  //     }
  //   } else {
  //     throw Error(
  //       'Seu usuário ainda não foi aprovado pela equipe da coordenação.',
  //     )
  //   }
  // }

  addApprovedUser(userApproved: IUserApproved) {
    this.user.next(userApproved)
  }

  signTerms(
    signatureDto: { termsUser: ItermUser[] },
    access_token: string,
  ): Observable<boolean> {
    console.log('no service front')
    return this.http
      .post<boolean>(
        environment.API + '/terms/sign/',

        signatureDto,

        {
          headers: { Authorization: 'bearer ' + access_token },
        },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(() => new Error(error.message))
        }),
      )
  }

  getPassCode(principalEmail: string) {
    return this.http
      .post<boolean>(environment.API + '/users/recover', {
        principalEmail,
      })
      .pipe(
        catchError((error) => {
          if (error.name == 'HttpErrorResponse') {
            return throwError(
              () => new Error('Não foi possível fazer contato com o servidor.'),
            )
          } else {
            return throwError(
              () =>
                new Error(
                  'Aconteceu um problema com a sua recuperação de senha',
                ),
            )
          }
        }),
        tap((resposta) => {
          console.log(resposta)
        }),
      )
  }

  comparePassCode(principalEmail: string, passCode: string) {
    return this.http
      .post<boolean>(environment.API + '/users/pass ', {
        principalEmail,
        passCode,
      })
      .pipe(
        catchError((error) => {
          if (error.name == 'HttpErrorResponse') {
            return throwError(
              () => new Error('Não foi possível fazer contato com o servidor.'),
            )
          } else {
            return throwError(
              () =>
                new Error(
                  'Aconteceu um problema com a sua recuperação de senha',
                ),
            )
          }
        }),
      )
  }

  changePassword(principalEmail: string, passCode: string) {
    return this.http
      .post<number>(environment.API + '/users/change ', {
        principalEmail,
        passCode,
      })
      .pipe(
        catchError((error) => {
          if (error.name == 'HttpErrorResponse') {
            return throwError(
              () => new Error('Não foi possível fazer contato com o servidor.'),
            )
          } else {
            return throwError(
              () =>
                new Error(
                  'Aconteceu um problema com a sua recuperação de senha',
                ),
            )
          }
        }),
      )
  }

  getRoles(token: string) {
    if (token) {
      this.userToken = token
      localStorage.setItem('access_token', this.userToken)
      this.http
        .get<IUserApproved>(environment.API + '/users/roles', {
          headers: { Authorization: 'bearer ' + token },
        })
        .subscribe({
          next: (userApproved) => {
            if (userApproved.user_approved) {
              this.user.next(userApproved)
              // this.router.navigateByUrl('/')
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
