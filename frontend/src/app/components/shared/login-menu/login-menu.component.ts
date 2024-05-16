import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { LoginService } from '../shared.service.ts/login.service'

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css'],
})
export class LoginMenuComponent {
  constructor(public service: LoginService, private router: Router) {}

  login() {
    this.router.navigateByUrl('/login')
  }

  logon() {
    this.router.navigateByUrl('/logon')
  }

  logout() {
    this.service.logout()
    this.router.navigateByUrl('/')
  }
}
