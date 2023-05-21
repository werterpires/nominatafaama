import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, max, throwError } from 'rxjs';
import { ICity, IUF } from '../types';


@Injectable({
  providedIn: 'root'
})
export class OthersServices {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };
  
  findAllStates(): Observable<IUF[]> {
    
    return this.http.get<IUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .pipe(
        catchError((error) => {
            console.log('erro de verdade: ', error)
            return throwError(() => new Error('No UFs'));
  
        })
      );
  }

  findAllCities(stateId:number): Observable<ICity[]> {
    
    return this.http.get<ICity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`)
      .pipe(
        catchError((error) => {
            console.log('erro de verdade: ', error)
            return throwError(() => new Error('No Cities'));
  
        })
      );
  }
  
}
