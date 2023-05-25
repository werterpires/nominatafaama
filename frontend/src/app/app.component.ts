import {Component} from '@angular/core'
import {DialogService} from './components/shared/shared.service.ts/dialog.service'
import {LoginService} from './components/shared/shared.service.ts/login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend'

  constructor(public dialogService: DialogService, loginService: LoginService) {
    loginService.loginCheck()
  }
}
