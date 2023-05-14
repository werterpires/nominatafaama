import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, max, throwError } from 'rxjs';
import { IUser, IUserApproved } from '../container/types';


@Injectable({
  providedIn: 'root'
})
export class ErrorServices {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };
  
  
  
}
