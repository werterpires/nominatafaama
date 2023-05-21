import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateHiringStatusDto, IHiringStatus, UpdateHiringStatusDto } from './types';
import { IUnion } from '../unions/types';


@Injectable({
  providedIn: 'root'
})
export class HiringStatusService {

  constructor(
    private http: HttpClient
  ) { }

  findAllHiringStatus(): Observable<IHiringStatus[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.get<IHiringStatus[]>('http://localhost:3000/hiring-status', { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível encontrar os Status de contratação cadastrados.'));
      })
    );
  }

  createHiringStatus(createHiringStatusData: CreateHiringStatusDto): Observable<IHiringStatus> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.post<IHiringStatus>('http://localhost:3000/hiring-status', createHiringStatusData, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível criar o status de contratação.'));
      })
    );
  }

  updateHiringStatus(updateHiringStatusData: UpdateHiringStatusDto): Observable<IHiringStatus> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.put<IHiringStatus>('http://localhost:3000/hirging-status', updateHiringStatusData, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível atualizar o status de contratação.'));
      })
    );
  }

  deleteHiringStatus(hiring_status_id: number): Observable<string> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.delete<string>(`http://localhost:3000/hiring-status/${hiring_status_id}`, { headers }).pipe(
      catchError((error) => {
        console.log('Veja o erro completo', error);
        return throwError(() => new Error('Não foi possível deletar o status de contratação.'));
      })
    );
  }
}
