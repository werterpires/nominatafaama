import { Component, Input, OnInit } from '@angular/core'
import { IPermissions, IUserApproved } from '../../shared/container/types'
import { IFieldRepresentation } from '../../records/representations/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { LoginService } from '../../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'
import { InvitesToApproveService } from './invites-to-approve.service'
import { ICompleteInvite } from '../../vacancies/invites/types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'
import { ApproveInviteDto } from './types'

@Component({
  selector: 'app-invites-to-approve',
  templateUrl: './invites-to-approve.component.html',
  styleUrls: ['./invites-to-approve.component.css'],
})
export class InvitesToApproveComponent implements OnInit {
  constructor(
    private invitesToApproveService: InvitesToApproveService,
    private loginService: LoginService,
    private router: Router,
    private errorService: ErrorServices,
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
        if (!roles.includes('direção') && !roles.includes('administrador')) {
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
    this.invitesToApproveService.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
        console.log(this.allRegistries)
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  approveInvite(approveRadio: string, rejectRadio: string, idx: number) {
    this.isLoading = true

    const approveInput = document.getElementById(
      approveRadio,
    ) as HTMLInputElement
    const rejectInput = document.getElementById(rejectRadio) as HTMLInputElement

    const approveValue = approveInput.checked
    const rejectValue = rejectInput.checked

    if (approveValue == rejectValue) {
      this.errorService.showError('Você precisa selecionar uma opção')
      this.isLoading = false
      return
    }

    const approved = approveValue
    const vacancyStudent = this.allRegistries[idx].vacancyStudent

    const approveInviteData: ApproveInviteDto = {
      vacancyStudentId: vacancyStudent.vacancyStudentId,
      vacancyId: vacancyStudent.vacancyId,
      studentId: vacancyStudent.studentId,
      approved,
      deadline: this.allRegistries[idx].deadline,
      inviteId: this.allRegistries[idx].inviteId,
    }

    this.invitesToApproveService.approveInvite(approveInviteData).subscribe({
      next: () => {
        this.doneMessage = 'Ação concluída com sucesso.'
        this.done = true
        this.isLoading = false
        if (approved) {
          rejectInput.classList.remove('setted')
          approveInput.classList.add('setted')
        } else {
          rejectInput.classList.add('setted')
          approveInput.classList.remove('setted')
        }

        this.ngOnInit()
      },
      error: (err) => {
        console.log(err.message)
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  closeDone() {
    this.done = false
  }
}
