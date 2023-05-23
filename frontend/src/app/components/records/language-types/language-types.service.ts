import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICreateLanguageTypeDto, ILanguageType, IUpdateLanguageType } from './types';

@Injectable({
  providedIn: 'root'
})
export class LanguageTypesService {


  constructor(private http: HttpClient) {}

  findAllLanguageTypes(): Observable<ILanguageType[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ILanguageType[]>(`http://localhost:3000/language-types`, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível encontrar os tipos de linguagem já cadastrados.'));
      })
    );
  }

  createLanguageType(createLanguageTypeData: ICreateLanguageTypeDto): Observable<ILanguageType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<ILanguageType>(`http://localhost:3000/language-types`, createLanguageTypeData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(() => new Error('Não foi possível criar o tipo de linguagem.'));
        })
      );
  }

  editLanguageType(editLanguageData: IUpdateLanguageType): Observable<ILanguageType> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<ILanguageType>(`http://localhost:3000/language-types`, editLanguageData, { headers })
      .pipe(
        catchError((error) => {
          console.log('Veja o erro completo', error);
          return throwError(() => new Error('Não foi possível atualizar o tipo de linguagem.'));
        })
      );
  }

}
