import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { INominata } from '../nominatas/types'
import { CreateNominataProfessors, ISinteticProfessor } from './types'

@Injectable({
  providedIn: 'root',
})
export class NominatasProfessorsService {
  constructor(private http: HttpClient) {}

  findAllNominatas(): Observable<INominata[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<INominata[]>(environment.API + '/nominatas', { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível encontrar as nominatas cadastradas.'),
          )
        }),
      )
  }

  findAllProfessors(): Observable<ISinteticProfessor[]> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .get<ISinteticProfessor[]>(environment.API + '/nominatas/professors', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error(
                'Não foi possível encontrar os professores da nominata selecionada.',
              ),
          )
        }),
      )
  }

  createRegistry(
    createAssociationData: CreateNominataProfessors,
  ): Observable<boolean> {
    const token = localStorage.getItem('access_token')
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`)
    return this.http
      .post<boolean>(
        environment.API + '/nominatas/professors',
        createAssociationData,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error)
          return throwError(
            () =>
              new Error('Não foi possível adicionar o professor à nominata.'),
          )
        }),
      )
  }
}
