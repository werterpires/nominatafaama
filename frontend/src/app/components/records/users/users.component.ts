import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { IPermissions, IRole } from '../../shared/container/types'
import { IUser, UpdateUserDto } from './types'
import { UsersServices } from './users.services'
import { LogonService } from '../../logon/logon.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef

  @Input() permissions!: IPermissions
  registry: IUser = {
    cpf: '',
    created_at: '',
    name: '',
    person_id: 0,
    principal_email: '',
    roles: [],
    updated_at: '',
    user_id: 0,
    user_approved: null,
  }
  currentPassword: string = ''
  newPassword: string = ''
  passwordConfirmation: string = ''
  roles: boolean[] = [false, false, false, false, false, false]
  constructor(
    private service: UsersServices,
    private logonService: LogonService,
  ) {}

  title = 'Dados de Usuário'
  allTypes: IRole[] = []

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  ngOnInit() {
    this.getRegistry()
    if (this.registry.person_id == null) {
      this.showForm = false
    }
  }

  getRegistry() {
    this.isLoading = true
    this.service.findRegistry().subscribe({
      next: (res) => {
        if (res && res.user_id) {
          this.registry = res
          this.registry.roles.forEach((role) => {
            this.roles[role.role_id - 1] = true
          })
        } else {
          this.showBox = true
          this.showForm = true
        }
        this.getAllOtherData()
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true

        this.getAllOtherData()
        this.isLoading = false
      },
    })
  }

  getAllOtherData() {
    this.isLoading = true
    this.service.findallRoles().subscribe({
      next: (res) => {
        this.allTypes = res
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  editRegistry() {
    this.isLoading = true

    const editRegistryData: UpdateUserDto = {
      current_password_hash: this.currentPassword,
      cpf: this.registry.cpf,
      name: this.registry.name,
      principal_email: this.registry.principal_email,
      roles_id: [],
    }

    if (this.newPassword.length > 0) {
      if (this.newPassword == this.passwordConfirmation) {
        editRegistryData.password_hash = this.newPassword
      } else {
        this.errorMessage =
          'A nova senha e a senha de confirmação precisam ser iguais.'
        this.error = true
        this.isLoading = false
      }
    }

    for (let i = 0; i < 7; i++) {
      if (this.roles[i]) {
        editRegistryData.roles_id?.push(i + 1)
      }
    }

    this.service.updateUser(editRegistryData).subscribe({
      next: (res) => {
        this.doneMessage = 'Usuário editado com sucesso.'
        this.done = true
        this.ngOnInit()
        this.passwordConfirmation = ''
        this.newPassword = ''
        this.currentPassword = ''
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível atualizar o usuário.'
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
