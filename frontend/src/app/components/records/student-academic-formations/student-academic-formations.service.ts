import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IStAcademicFormation, IStCreateAcademicFormation, IStUpdateAcademicFormation } from './types';


@Injectable({
  providedIn: 'root'
})
export class StudentAcademicFormationsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  findAllAcademicFormations(): Observable<IStAcademicFormation[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<IStAcademicFormation[]>('http://localhost:3000/academic-formations', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar as formações.'));
          
        })
      );
  }

  findAllStudentAcademicFormations(): Observable<IStAcademicFormation[]>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<IStAcademicFormation[]>('http://localhost:3000/academic-formations/student', { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível encontrar as formações acadêmicas.'));
          
        })
      );
  }

  createStudentAcademicFormation(createAcademicFormationData:IStCreateAcademicFormation): Observable<IStAcademicFormation>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.post<IStAcademicFormation>('http://localhost:3000/academic-formations/student', createAcademicFormationData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar a formação acadêmica.'));
          
        })
      );
  }

  editStudentAcademicFormation(editAcademicFormationData:IStUpdateAcademicFormation): Observable<IStAcademicFormation>{
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.put<IStAcademicFormation>('http://localhost:3000/academic-formations', editAcademicFormationData, { headers: head_obj })
      .pipe(
        catchError((error) => {
            console.log('Veja o erro completo', error)
            return throwError(() => new Error('Não foi possível criar o estado civil.'));
          
        })
      );
  }

}
