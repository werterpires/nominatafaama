import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICreateMinistryTypeDto, IMinistryType, IUpdateMinistryType } from './types';

@Injectable({
  providedIn: 'root'
})
export class MinistryTypesService {
  constructor(private http: HttpClient) {}

  findAllMinistryTypes(): Observable<IMinistryType[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IMinistryType[]>(`http://localhost:3000/ministry-types`, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível encontrar os tipos de ministério já cadastrados.'));
      })
    );
  }

  createMinistryType(createMinistryTypeData: ICreateMinistryTypeDto): Observable<IMinistryType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<IMinistryType>(`http://localhost:3000/ministry-types`, createMinistryTypeData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(() => new Error('Não foi possível criar o tipo de ministério.'));
        })
      );
  }

  editMinistryType(editMinistryTypeData: IUpdateMinistryType): Observable<IMinistryType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<IMinistryType>(`http://localhost:3000/ministry-types`, editMinistryTypeData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(() => new Error('Não foi possível atualizar o tipo de ministério.'));
        })
      );
  }
}