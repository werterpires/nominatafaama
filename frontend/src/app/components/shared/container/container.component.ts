import {Component} from '@angular/core'
import {LoginService} from '../shared.service.ts/login.service'
import {IOptions, IPermissions, IUserApproved} from './types'

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent {
  loginMenu = false

  constructor(private loginService: LoginService) {}
  permissions: IPermissions = {
    estudante: false,
    secretaria: false,
    direcao: false,
    representacao: false,
    administrador: false,
    isApproved: false,
  }
  user: IUserApproved | null = null

  options: IOptions = {
    nominata: true,
    cadastros: false,
    aprovacoes: false,
    vagas: false,
    chamados: false,
  }

  choseOption(chosenOption: string): void {
    Object.keys(this.options).forEach((option: string) => {
      this.options[option as keyof IOptions] = false
    })
    this.options[chosenOption as keyof IOptions] = true
  }

  ngOnInit(): void {
    this.loginService.user$.subscribe((user) => {
      let roles: Array<string> = []
      if (user) {
        this.user = user
        roles = this.user.roles.map((role) => role.role_name.toLowerCase())
        this.permissions.isApproved = this.user.user_approved
      } else {
        this.user = null
        this.permissions.isApproved = false
      }
      this.permissions.estudante = roles.includes('estudante')
      this.permissions.secretaria = roles.includes('secretaria')
      this.permissions.direcao = roles.includes('direção')
      this.permissions.representacao = roles.includes('representacao')
      this.permissions.administrador = roles.includes('administrador')
    })
  }
}
