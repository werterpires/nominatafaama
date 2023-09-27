import { Component, Input } from '@angular/core'
import {
  IPermissions,
  IRole,
  IUserApproved,
} from '../../shared/container/types'
import { UsersServices } from '../../records/users/users.services'
import { UserApprovesService } from './users-approves.service'
import { IUser } from '../../records/users/types'
import { LoginService } from '../../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-users-approves',
  templateUrl: './users-approves.component.html',
  styleUrls: ['./users-approves.component.css'],
})
export class UsersApprovesComponent {
  constructor(
    private userServices: UsersServices,
    private usersApprovesServices: UserApprovesService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  allUsers!: IUser[]
  admUsersNull: IUser[] = []
  admUsersTrue: IUser[] = []
  admUsersFalse: IUser[] = []
  repUsersNull: IUser[] = []
  repUsersTrue: IUser[] = []
  repUsersFalse: IUser[] = []
  dirUsersNull: IUser[] = []
  dirUsersTrue: IUser[] = []
  dirUsersFalse: IUser[] = []
  secUsersNull: IUser[] = []
  secUsersTrue: IUser[] = []
  secUsersFalse: IUser[] = []
  docUsersNull: IUser[] = []
  docUsersTrue: IUser[] = []
  docUsersFalse: IUser[] = []
  estUsersNull: IUser[] = []
  estUsersTrue: IUser[] = []
  estUsersFalse: IUser[] = []

  viewAdmUsersNull = true
  viewAdmUsersTrue = false
  viewAdmUsersFalse = false
  viewRepUsersNull = true
  viewRepUsersTrue = false
  viewRepUsersFalse = false
  viewDirUsersNull = true
  viewDirUsersTrue = false
  viewDirUsersFalse = false
  viewSecUsersNull = true
  viewSecUsersTrue = false
  viewSecUsersFalse = false
  viewDocUsersNull = true
  viewDocUsersTrue = false
  viewDocUsersFalse = false
  viewEstUsersNull = true
  viewEstUsersTrue = false
  viewEstUsersFalse = false

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

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  ngOnInit(): void {
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

    this.userServices.findAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res

        this.admUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          6,
        )
        this.admUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          6,
        )
        this.admUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          6,
        )
        this.repUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          5,
        )
        this.repUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          5,
        )
        this.repUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          5,
        )
        this.dirUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          4,
        )
        this.dirUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          4,
        )
        this.dirUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          4,
        )
        this.secUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          3,
        )
        this.secUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          3,
        )
        this.secUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          3,
        )
        this.docUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          2,
        )
        this.docUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          2,
        )
        this.docUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          2,
        )
        this.estUsersNull = this.userServices.filterUsers(
          null,
          this.allUsers,
          1,
        )
        this.estUsersFalse = this.userServices.filterUsers(
          false,
          this.allUsers,
          1,
        )
        this.estUsersTrue = this.userServices.filterUsers(
          true,
          this.allUsers,
          1,
        )

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  approveUser(
    approveRadio: string,
    rejectRadio: string,
    user_id: number,
    roles: IRole[],
  ) {
    this.isLoading = true

    const approveInput = document.getElementById(
      approveRadio,
    ) as HTMLInputElement
    const rejectInput = document.getElementById(rejectRadio) as HTMLInputElement

    const approveValue = approveInput.checked
    const rejectValue = rejectInput.checked

    if (approveValue == rejectValue) {
      this.errorMessage = 'Você precisa selecionar uma das opções.'
      this.error = true
      this.isLoading = false
      return
    }
    const approved = approveValue

    this.usersApprovesServices
      .approveUser({ user_id, user_approved: approved, roles })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Status modificao com sucesso.'
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
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
