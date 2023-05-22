import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAcademicDegree, ICreateAcademicDegreeDto, IUpdateAcademicDegree } from './types';


@Injectable({
  providedIn: 'root'
})
export class AcademicDegreeService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  findAllAcademicDegrees(): Observable<IAcademicDegree[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<IAcademicDegree[]>('http://localhost:3000/academic-degrees', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar os Estados Civis já cadastrados.'));
          
        })
      );
  }

  createAcademicDegree(createAcademicDegreeData:ICreateAcademicDegreeDto): Observable<IAcademicDegree>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.post<IAcademicDegree>('http://localhost:3000/academic-degrees', createAcademicDegreeData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

  editAcademicDegree(editAcademicDegreeData:IUpdateAcademicDegree): Observable<IAcademicDegree>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.put<IAcademicDegree>('http://localhost:3000/academic-degrees', editAcademicDegreeData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

}
