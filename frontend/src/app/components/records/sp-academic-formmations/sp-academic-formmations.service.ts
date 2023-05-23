import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ISpAcademicFormation, ISpCreateAcademicFormation, ISpUpdateAcademicFormation } from './types';


@Injectable({
  providedIn: 'root'
})
export class SpAcademicFormationsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  findAllAcademicFormations(): Observable<ISpAcademicFormation[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<ISpAcademicFormation[]>('http://localhost:3000/academic-formations', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar as formações.'));
          
        })
      );
  }

  findAllSpAcademicFormations(): Observable<ISpAcademicFormation[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<ISpAcademicFormation[]>('http://localhost:3000/academic-formations/spouse', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar as formações acadêmicas.'));
          
        })
      );
  }

  createSpAcademicFormation(createAcademicFormationData:ISpCreateAcademicFormation): Observable<ISpAcademicFormation>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.post<ISpAcademicFormation>('http://localhost:3000/academic-formations/spouse', createAcademicFormationData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar a formação acadêmica.'));
          
        })
      );
  }

  editSpAcademicFormation(editAcademicFormationData:ISpUpdateAcademicFormation): Observable<ISpAcademicFormation>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.put<ISpAcademicFormation>('http://localhost:3000/academic-formations', editAcademicFormationData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

}
