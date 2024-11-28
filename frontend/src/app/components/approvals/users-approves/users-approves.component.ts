import { Component, Input, OnInit } from '@angular/core'
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
import { UsersAprovesTypes, UserType } from './types'
import { ApproveUserObj } from './aprove-by-user-type/types'

@Component({
  selector: 'app-users-approves',
  templateUrl: './users-approves.component.html',
  styleUrls: ['./users-approves.component.css'],
})
export class UsersApprovesComponent implements OnInit {
  usersType = ''
  usersTitle = ''
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
  desUsersNull: IUser[] = []
  desUsersTrue: IUser[] = []
  desUsersFalse: IUser[] = []
  minUsersNull: IUser[] = []
  minUsersTrue: IUser[] = []
  minUsersFalse: IUser[] = []

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
  viewDesUsersNull = true
  viewDesUsersTrue = false
  viewDesUsersFalse = false
  viewMinUsersNull = true
  viewMinUsersTrue = false
  viewMinUsersFalse = false

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

  userTypes: UserType[] = [
    {
      name: 'Administradores/as',
      requiredRole: 'administrador',
    },
    {
      name: 'Secretários/as',
      requiredRole: 'secretaria',
    },
    {
      name: 'Diretores',
      requiredRole: 'direcao',
    },
    {
      name: 'Representantes de campo',
      requiredRole: 'representacao',
    },
    {
      name: 'Docentes',
      requiredRole: 'docente',
    },
    {
      name: 'Ministeriais',
      requiredRole: 'ministerial',
    },
    {
      name: 'Designers',
      requiredRole: 'design',
    },
    {
      name: 'Estudantes',
      requiredRole: 'estudante',
    },
  ]

  choseUsers(userType: string) {
    const type = this.userTypes.find((type) => type.requiredRole === userType)
    if (!type) {
      return
    }
    this.usersTitle = type.name
    this.usersType = type.requiredRole
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
          !roles.includes('direção') &&
          !roles.includes('administrador') &&
          !roles.includes('ministerial')
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
      this.permissions.representacao = roles.includes('representante de campo')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
    })

    // this.userServices.findAllUsers().subscribe({
    //   next: (res) => {
    //     this.allUsers = res

    //     this.desUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       0,
    //     )
    //     this.desUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       0,
    //     )
    //     this.desUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       0,
    //     )
    //     this.minUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       5,
    //     )
    //     this.minUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       5,
    //     )
    //     this.minUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       5,
    //     )
    //     this.admUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       7,
    //     )
    //     this.admUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       7,
    //     )
    //     this.admUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       7,
    //     )
    //     this.repUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       4,
    //     )
    //     this.repUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       4,
    //     )
    //     this.repUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       4,
    //     )
    //     this.dirUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       6,
    //     )
    //     this.dirUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       6,
    //     )
    //     this.dirUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       6,
    //     )
    //     this.secUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       3,
    //     )
    //     this.secUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       3,
    //     )
    //     this.secUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       3,
    //     )
    //     this.docUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       2,
    //     )
    //     this.docUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       2,
    //     )
    //     this.docUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       2,
    //     )
    //     this.estUsersNull = this.userServices.filterUsers(
    //       null,
    //       this.allUsers,
    //       1,
    //     )
    //     this.estUsersFalse = this.userServices.filterUsers(
    //       false,
    //       this.allUsers,
    //       1,
    //     )
    //     this.estUsersTrue = this.userServices.filterUsers(
    //       true,
    //       this.allUsers,
    //       1,
    //     )

    //     this.isLoading = false
    //   },
    //   error: (err) => {
    //     this.errorMessage = err.message
    //     this.error = true
    //     this.isLoading = false
    //   },
    // })
  }

  getUsersToApprove(requiredRole: string, status: boolean | null) {
    this.isLoading = true
    let statusToString = 'null'
    if (status) {
      statusToString = 'true'
    } else if (status === false) {
      statusToString = 'false'
    }

    this.usersApprovesServices
      .getUsersToApprove(requiredRole, statusToString)
      .subscribe({
        next: (res) => {
          this.allUsers = res
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

  approveUserNew(approveUserObj: ApproveUserObj) {
    this.isLoading = true

    if (approveUserObj.approveString == null) {
      this.errorMessage = 'Você precisa selecionar uma das opções.'
      this.error = true
      this.isLoading = false
      return
    }

    this.usersApprovesServices
      .approveUser({
        user_id: approveUserObj.userId,
        user_approved: approveUserObj.approveString,
        roles: approveUserObj.userRoles,
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Status modificao com sucesso.'
          this.done = true
          this.isLoading = false
          const userIndex = this.allUsers.findIndex(
            (user) => user.user_id == approveUserObj.userId,
          )

          this.allUsers.splice(userIndex, 1)
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
