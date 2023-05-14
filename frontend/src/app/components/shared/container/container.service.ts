import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IRole, IUserApproved } from './types';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private http: HttpClient) { }

  findCurrentUser(): Observable<IUserApproved> {
    const token = localStorage.getItem('access_token');
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token);
    return this.http.get<IUserApproved>('http://localhost:3000/users/roles', { headers: head_obj })
      .pipe(
        catchError((error) => {
          
            return throwError(() => new Error('No User'));
  
        })
      );
  }

  

}
