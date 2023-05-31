import { Component, Input } from '@angular/core'
import { IPermissions, IRole, IUser } from '../../shared/container/types'
import { UsersServices } from '../../shared/shared.service.ts/users.services'
import { UserApprovesService } from './users-approves.service'

@Component({
  selector: 'app-users-approves',
  templateUrl: './users-approves.component.html',
  styleUrls: ['./users-approves.component.css'],
})
export class UsersApprovesComponent {
  constructor(
    private userServices: UsersServices,
    private usersApprovesServices: UserApprovesService,
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

  viewAdmUsersNull: boolean = true
  viewAdmUsersTrue: boolean = false
  viewAdmUsersFalse: boolean = false
  viewRepUsersNull: boolean = true
  viewRepUsersTrue: boolean = false
  viewRepUsersFalse: boolean = false
  viewDirUsersNull: boolean = true
  viewDirUsersTrue: boolean = false
  viewDirUsersFalse: boolean = false
  viewSecUsersNull: boolean = true
  viewSecUsersTrue: boolean = false
  viewSecUsersFalse: boolean = false
  viewDocUsersNull: boolean = true
  viewDocUsersTrue: boolean = false
  viewDocUsersFalse: boolean = false
  viewEstUsersNull: boolean = true
  viewEstUsersTrue: boolean = false
  viewEstUsersFalse: boolean = false

  @Input() permissions!: IPermissions

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  ngOnInit(): void {
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
