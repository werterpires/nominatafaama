import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CreatePublicationTypeDto,
  IPublicationType,
  UpdatePublicationTypeDto,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class PublicationTypeService {
  constructor(private http: HttpClient) {}

  findAllPublicationTypes(): Observable<IPublicationType[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http
      .get<IPublicationType[]>('http://localhost:3000/publication-types', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(
            () => new Error('Não foi possível encontrar as unions cadastradas.')
          );
        })
      );
  }

  createPublicationType(
    createPublicationTypeData: CreatePublicationTypeDto
  ): Observable<IPublicationType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http
      .post<IPublicationType>(
        'http://localhost:3000/publication-types',
        createPublicationTypeData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(() => new Error('Não foi possível criar a union.'));
        })
      );
  }

  updatePublicationType(
    updatePublicationTypeData: UpdatePublicationTypeDto
  ): Observable<IPublicationType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http
      .put<IPublicationType>(
        'http://localhost:3000/publication-types',
        updatePublicationTypeData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(
            () => new Error('Não foi possível atualizar a union.')
          );
        })
      );
  }

  deletePublicationType(publicationTypeId: number): Observable<string> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http
      .delete<string>(
        `http://localhost:3000/publication-types/${publicationTypeId}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(
            () => new Error('Não foi possível deletar a union.')
          );
        })
      );
  }
}
