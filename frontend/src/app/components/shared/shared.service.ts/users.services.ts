import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, catchError, max, throwError } from 'rxjs'
import { IUser, IUserApproved } from '../container/types'
import { environment } from 'src/environments/environment'

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
    isApproved: number | null,
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
}
