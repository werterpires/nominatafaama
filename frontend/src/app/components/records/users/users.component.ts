import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { IPermissions, IRole } from '../../shared/container/types'
import { IUser, UpdateUserDto } from './types'
import { UsersServices } from './users.services'
import { LogonService } from '../../logon/logon.service'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'
import { LoginService } from '../../shared/shared.service.ts/login.service'

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
  currentPassword = ''
  newPassword = ''
  passwordConfirmation = ''
  roles: boolean[] = [false, false, false, false, false, false, false, false]
  constructor(
    private service: UsersServices,
    private validateService: ValidateService,
    private loginService: LoginService,
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
  alert = false
  alertMessage = ''

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
        this.formatarCPF()
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
  formatarCPF() {
    this.registry.cpf = this.registry.cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    )
  }

  editRegistry() {
    this.isLoading = true

    if (this.validateService.validateNameData(this.registry.name) == false) {
      this.errorMessage = 'Insira um nome válido para editar o usuário.'
      this.error = true
      this.isLoading = false
      return
    }
    this.registry.cpf = this.registry.cpf.replace(/[^\d]/g, '')
    if (this.validateService.validateCpfData(this.registry.cpf) == false) {
      this.errorMessage = 'Insira um cpf válido para editar o usuário.'
      this.error = true
      this.isLoading = false
      this.ngOnInit()
      return
    }

    if (
      this.validateService.validateEmailData(this.registry.principal_email) ==
      false
    ) {
      this.errorMessage = 'Insira um email válido para editar o usuário.'
      this.error = true
      this.isLoading = false
      this.ngOnInit()
      return
    }

    if (
      this.validateService.validatePasswordData(this.newPassword) == false &&
      this.newPassword.length > 0
    ) {
      this.errorMessage =
        'A nova senha deve conter maiúsculas, minúsculas, números, símbolos e ter pelo menos 8 caracteres.'
      this.error = true
      this.isLoading = false
      this.ngOnInit()
      return
    }

    if (this.newPassword != this.passwordConfirmation) {
      this.errorMessage = 'A nova senha não confere com a confirmação.'
      this.error = true
      this.isLoading = false
      this.ngOnInit()
      return
    }

    if (
      this.validateService.validatePasswordData(this.currentPassword) == false
    ) {
      this.errorMessage =
        'É necessário inserir sua senha atual para alterar dados do usuário.'
      this.error = true
      this.isLoading = false
      return
    }

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

    for (let i = 0; i < 9; i++) {
      if (this.roles[i]) {
        editRegistryData.roles_id?.push(i + 1)
      }
    }

    if (editRegistryData.roles_id && editRegistryData.roles_id.length < 1) {
      this.errorMessage =
        'É necessário escolher ao menos um papel para o usuário.'
      this.error = true
      this.isLoading = false
      this.ngOnInit()
      return
    }

    this.service.updateUser(editRegistryData).subscribe({
      next: (res) => {
        this.doneMessage = 'Usuário editado com sucesso.'
        this.done = true

        this.passwordConfirmation = ''
        this.newPassword = ''
        this.currentPassword = ''
        this.isLoading = false
        this.loginService.logout()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível atualizar o usuário.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  showAlert() {
    this.alertMessage =
      'Ao confirmar, você será automaticamente deslogado e só poderá fazer login novamente após ser aprovado pela equipe da coordenação.'
    this.alert = true
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }

  closeAlert() {
    this.alert = false
  }
}
