import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto } from './login.Dto';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };



  login(loginData: ILoginDto) {

    this.http.post('http://localhost:3000/login', loginData)
      .subscribe(res => {
        localStorage.setItem("access_token", JSON.parse(JSON.stringify(res)).access_token)
        this.router.navigate(['/resources']);

      })

  }
}
