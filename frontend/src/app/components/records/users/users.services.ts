import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, catchError, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IUser, UpdateUserDto } from './types'
import { IRole } from '../../shared/container/types'

@Injectable({
  providedIn: 'root',
})
export class UsersServices {
  constructor(private http: HttpClient, private router: Router) {}

  findAllUsers(): Observable<IUser[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IUser[]>(environment.API + '/users/', { headers: head_obj })
      .pipe(
        catchError((error) => {
          console.log('erro de verdade: ', error)
          return throwError(() => new Error('No User'))
        }),
      )
  }

  filterUsers(
    isApproved: boolean | null,
    allUsers: IUser[],
    maxId: number,
  ): IUser[] {
    const filteredUsers = allUsers.filter((user) => {
      return (
        user.user_approved === isApproved &&
        user.roles.some((role) => {
          return role.role_id === maxId
        }) &&
        !user.roles.some((role) => {
          return role.role_id > maxId
        })
      )
    })
    return filteredUsers
  }

  findRegistry(): Observable<IUser> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<IUser>(environment.API + '/users/edit', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar o usuário requisitado.'),
          )
        }),
      )
  }

  updateUser(updateUserData: UpdateUserDto): Observable<IUser> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .put<IUser>(environment.API + '/users/update', updateUserData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () => new Error('Não foi possível atualizar o estudante.'),
          )
        }),
      )
  }

  findallRoles(): Observable<IRole[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<IRole[]>(environment.API + '/roles/', { headers: head_obj })
      .pipe(
        catchError((error) => {
          console.log('erro de verdade: ', error)
          return throwError(() => new Error('No User'))
        }),
      )
  }
}
