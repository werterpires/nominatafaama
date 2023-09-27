import { Component, Input } from '@angular/core'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.css'],
})
export class ParameterizationComponent {
  @Input() permissions: IPermissions = {
    estudante: false,
    secretaria: false,
    direcao: false,
    representacao: false,
    administrador: false,
    docente: false,
    isApproved: false,
  }

  user: IUserApproved | null = null

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loginService.user$.subscribe((user) => {
      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []

      if (typeof user !== 'string' && user) {
        this.user = user

        roles = this.user.roles.map((role) => role.role_name.toLowerCase())
        if (
          !roles.includes('secretaria') &&
          !roles.includes('direcao') &&
          !roles.includes('administrador')
        ) {
          this.router.navigate(['nominata'])
        }

        this.permissions.isApproved = this.user.user_approved
      } else {
        this.user = null
        this.router.navigate(['nominata'])
        this.permissions.isApproved = false
      }
      this.permissions.estudante = roles.includes('estudante')
      this.permissions.secretaria = roles.includes('secretaria')
      this.permissions.direcao = roles.includes('direção')
      this.permissions.representacao = roles.includes('representacao')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
    })
  }
}
