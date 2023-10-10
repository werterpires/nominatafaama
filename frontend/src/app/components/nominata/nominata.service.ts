import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ICompleteUser } from '../approvals/student-to-approve/types'
import { ICompleteNominata } from './types'

@Injectable({
  providedIn: 'root',
})
export class NominataService {
  constructor(private http: HttpClient) {}

  findAllRegistries(nominata_year: string): Observable<ICompleteNominata> {
    const token = localStorage.getItem('access_token')
    const head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
    return this.http
      .get<ICompleteNominata>(environment.API + `/nominatas/${nominata_year}`, {
        headers: head_obj,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                `Não foi possível encontrar os estudantes cadastrados na nominata do ano ${nominata_year}.`,
              ),
          )
        }),
      )
  }

  //   findRegistriesByName(searchString: string): Observable<ICompleteUser[]> {
  //     const token = localStorage.getItem('access_token')
  //     let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //     return this.http
  //       .get<ICompleteUser[]>(
  //         environment.API + `/nominata/search/${searchString}`,
  //         {
  //           headers: head_obj,
  //         },
  //       )
  //       .pipe(
  //         catchError((error) => {
  //           console.log('Veja o erro completo', error)
  //           return throwError(
  //             () => new Error('Não foi possível encontrar estudantes.'),
  //           )
  //         }),
  //       )
  //   }

  //   findOneRegistry(userId: number): Observable<ICompleteStudent> {
  //     const token = localStorage.getItem('access_token')
  //     let head_obj = new HttpHeaders().set('Authorization', 'bearer ' + token)
  //     return this.http
  //       .get<ICompleteStudent>(environment.API + `/approvals/${userId}`, {
  //         headers: head_obj,
  //       })
  //       .pipe(
  //         catchError((error) => {
  //           console.log('Veja o erro completo', error)
  //           return throwError(
  //             () => new Error('Não foi possível encontrar o estudante selecionado.'),
  //           )
  //         }),
  //       )
  //   }
}
