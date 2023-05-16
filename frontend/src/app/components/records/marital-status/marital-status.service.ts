import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateMaritalStatusDto, IMaritalStatus, IUpdateMaritalStatus } from './types'


@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };



  findAllMaritalStatus(): Observable<IMaritalStatus[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<IMaritalStatus[]>('http://localhost:3000/marital-status', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar os Estados Civis já cadastrados.'));
          
        })
      );
  }

  createMaritalStatus(createMaritalStatusData:CreateMaritalStatusDto): Observable<IMaritalStatus>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.post<IMaritalStatus>('http://localhost:3000/marital-status', createMaritalStatusData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

  editMaritalStatus(editMaritalStatusData:IUpdateMaritalStatus): Observable<IMaritalStatus>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.put<IMaritalStatus>('http://localhost:3000/marital-status', editMaritalStatusData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

 
}
