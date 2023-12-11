import { Component, Input, OnInit } from '@angular/core'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'
import { ErrorServices } from '../shared/shared.service.ts/error.service'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { ICompleteInvite } from '../vacancies/invites/types'
import { CallsService } from './calls.service'
import { AcceptInviteDto } from './types'
import { AlertServices } from '../shared/alert/alert.service'
import { AlertFunctions } from '../shared/alert/types'

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css'],
})
export class CallsComponent implements OnInit {
  constructor(
    private callsService: CallsService,
    private loginService: LoginService,
    private router: Router,
    private errorService: ErrorServices,
    public alertService: AlertServices,
  ) {}

  @Input() permissions: IPermissions = {
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

  isLoading = false
  done = false
  doneMessage = ''
  error = false

  allRegistries: ICompleteInvite[] = []
  user: IUserApproved | null = null

  ngOnInit() {
    this.loginService.user$.subscribe((user) => {
      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []

      if (typeof user !== 'string' && user) {
        this.user = user

        roles = this.user.roles.map((role) => role.role_name.toLowerCase())
        if (!roles.includes('estudante') && !roles.includes('administrador')) {
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
      this.permissions.representacao = roles.includes('representante de campo')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
    })
    this.errorService.error$.subscribe((error) => {
      this.error = error
    })
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.callsService.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = []
        this.allRegistries = res

        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  alertFunctions = {
    acceptInvite: this.acceptInvite.bind(this),
  }

  handleAlert(func: string, index: number | null) {
    this.alertFunctions['acceptInvite'](index)
  }

  acceptInvite(idx: number | null) {
    this.isLoading = true

    if (idx === null || idx === undefined) {
      this.errorService.showError(
        'Não foi possível aceitar/recusar o convite. Se o erro persistir, entre em contato contato com a administração do sistema.',
      )
      this.isLoading = false
      return
    }

    const approveInput = document.getElementById(
      'approveRepresent' + idx,
    ) as HTMLInputElement
    const rejectInput = document.getElementById(
      'rejectRepresent' + idx,
    ) as HTMLInputElement

    const approveValue = approveInput.checked
    const rejectValue = rejectInput.checked

    if (approveValue == rejectValue) {
      this.errorService.showError('Você precisa selecionar uma opção')
      this.isLoading = false
      return
    }

    const accepted = approveValue

    const vacancyStudent = this.allRegistries[idx].vacancyStudent

    const acceptInviteData: AcceptInviteDto = {
      vacancyStudentId: vacancyStudent.vacancyStudentId,
      vacancyId: vacancyStudent.vacancyId,
      studentId: vacancyStudent.studentId,
      accept: accepted,
      deadline: this.allRegistries[idx].deadline,
      inviteId: this.allRegistries[idx].inviteId,
    }

    this.callsService.acceptInvite(acceptInviteData).subscribe({
      next: () => {
        this.doneMessage = 'Ação concluída com sucesso.'
        this.done = true
        this.isLoading = false
        if (accepted) {
          rejectInput.classList.remove('setted')
          approveInput.classList.add('setted')
        } else {
          rejectInput.classList.add('setted')
          approveInput.classList.remove('setted')
        }

        this.getAllRegistries()
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  closeDone() {
    this.done = false
  }
}
