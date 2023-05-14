import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILoginDto } from './login.Dto';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateService } from '../shared/shared.service.ts/validate.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private loginService:LoginService, 
  private validateService:ValidateService,
  private router: Router){};

  @Output() mailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
 
  errorMessage:string = ""
  error!: boolean

  loginData:ILoginDto = {
    email: "",
    password:""
  }

  seePassword:boolean = false
  isLoading:boolean = false

  validateEmailData() {
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    const valid = this.validateService.validateEmailData(this.loginData.email)
    this.validateService.colorInput(valid, emailInput)
    
  }
  
  validatePasswordData() {
    const passwordInput = document.getElementById('senhaInput') as HTMLInputElement;
    const valid = this.validateService.validatePasswordData(this.loginData.password)
    this.validateService.colorInput(valid, passwordInput)
  }

  
  login() {
    this.isLoading=true

    const isValidEmail = this.validateService.validateEmailData(this.loginData.email)  
    if(!isValidEmail){
      this.errorMessage = 'Digite um email válido para prosseguir com o login'
          this.error = true
          this.isLoading = false
          return      
      }
    const isValidPass = this.validateService.validatePasswordData(this.loginData.password)
      if(!isValidPass){
        this.errorMessage = 'A senha deve conter pelo menos 8 caracteres, sendo´pelo menos uma letra minúscula, pelo menos uma letra maiúscula, pelo menos um símbolo e pelo menos um número.'
        this.error = true
        this.isLoading = false
        return
      }
    
    this.loginService.login(this.loginData).subscribe({
      
      next: res => {
      
        
        
        localStorage.setItem("access_token", JSON.parse(JSON.stringify(res)).access_token)
        this.router.navigate(['/']);
        this.isLoading = false
      },
      error: err => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      }
    });
  }

  showPassword(){
    this.seePassword = !this.seePassword

    const passwordInput = document.getElementById('senhaInput') as HTMLInputElement;
    if (this.seePassword) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  closeError(){
    this.error = false
  }

}
