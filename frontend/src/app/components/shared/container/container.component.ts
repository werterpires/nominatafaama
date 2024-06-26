import { Component, Input, OnInit } from '@angular/core'
import { LoginService } from '../shared.service.ts/login.service'
import { IOptions, IPermissions, IUserApproved } from './types'
import { Router } from '@angular/router'
import { ContainerService } from './container.service'

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent implements OnInit {
  loginMenu = false
  approvalMenu = false
  notifications = false
  studentId!: number

  constructor(
    private loginService: LoginService,
    private router: Router,
    private containerService: ContainerService,
  ) {}
  permissions: IPermissions = {
    estudante: false,
    secretaria: false,
    direcao: false,
    representacao: false,
    administrador: false,
    docente: false,
    ministerial: false,
    design: false,
    isApproved: false,
  }
  user: IUserApproved | null = null

  options: IOptions = {
    nominata: false,
    cadastros: false,
    aprovacoes: false,
    vagas: false,
    chamados: false,
    parametrizacao: false,
    student: false,
  }

  @Input() approvalType = 'students'

  menu = false
  isMobile = false

  notif = false

  choseOption(chosenOption: string): void {
    Object.keys(this.options).forEach((option: string) => {
      this.options[option as keyof IOptions] = false
    })
    this.options[chosenOption as keyof IOptions] = true
    this.loginMenu = false
  }

  ngOnInit(): void {
    this.loginService.user$.subscribe((user) => {
      this.isMobile = window.innerWidth <= 1024

      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []
      if (typeof user !== 'string' && user) {
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

      this.permissions.representacao = roles.includes('representante de campo')

      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
      this.findAtLestOneNotificaton()
    })
  }

  findAtLestOneNotificaton() {
    this.containerService.existsAtLeastOneNotification().subscribe({
      next: (res) => {
        this.notif = res
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  changeApprovalType(approvaltype: string) {
    this.navigate('approve/' + approvaltype)
  }

  changeToStudent(parameter: { option: string; studentId: string }) {
    this.studentId = parseInt(parameter.studentId)
    this.choseOption(parameter.option)
  }

  navigate(route: string) {
    this.choseOption(route)
    this.router.navigate([route])
  }
}
