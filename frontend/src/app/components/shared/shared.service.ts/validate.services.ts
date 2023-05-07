import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  validateEmailData(email:string): boolean {
    
    // Verifica se o email é válido
    if (this.emailRegex.test(email)) {
      return true
    } else{
      return false
    }
  }
}
