import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto } from './login.Dto';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };



  login(loginData: ILoginDto) {
    return this.http.post('http://localhost:3000/login', loginData)
      .pipe(
        catchError((error) => {
          if(error.statusText = 'Unauthorized'){
            return throwError(() => new Error('Senha ou email não localizados.'));
          }else if(error.name = "HttpErrorResponse"){
            return throwError(() => new Error('Não foi possível fazer contato com o servidor.'));
          } else {
            return throwError(() => new Error('Aconteceu um problema com o seu login'));
          }
          
        })
      );
  }
}
