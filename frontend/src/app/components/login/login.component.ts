import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILoginDto } from './login.Dto';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateService } from '../shared/shared.service.ts/validate.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private loginService:LoginService, 
  private validateService:ValidateService){};

  @Output() mailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
 

  loginForm!: FormGroup;

  loginData:ILoginDto = {
    email: "",
    password:""
  }

  seePassword:boolean = false

  validateEmailData(): boolean {
    const passwordInput = document.getElementById('emailInput') as HTMLInputElement;
    const validEmail = this.validateService.validateEmailData(this.loginData.email)
    
    // Verifica se o email é válido
    if (validEmail) {
      passwordInput.style.borderBottomColor = 'green'
    } else{
      passwordInput.style.borderBottomColor = 'red'
    }

    return true;
  }

  login(){

    this.loginService.login(this.loginData)
  }

  showPassword(){
    this.seePassword = !this.seePassword
    console.log('uau')
    const passwordInput = document.getElementById('senhaInput') as HTMLInputElement;
  if (this.seePassword) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
  }

}
