import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILoginDto } from './login.Dto';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private loginService:LoginService){};
  @Output() mailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();

  loginData:ILoginDto = {
    email: "",
    password:""
  }

  login(){

    this.loginService.login(this.loginData)
  }

}
