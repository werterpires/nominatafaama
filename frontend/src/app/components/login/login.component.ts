import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { ValidateService } from '../shared/shared.service.ts/validate.services'
import { ILoginDto } from './login.Dto'
import { ITerm } from '../logon/types/logon.types'
import { IUserApproved } from '../shared/container/types'
import { ItermUser } from '../logon/logon.Dto'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private validateService: ValidateService,
    private router: Router,
  ) {}

  @Output() mailChange = new EventEmitter<string>()
  @Output() passwordChange = new EventEmitter<string>()

  errorMessage = ''
  error!: boolean
  forgot = 0
  accessCode = ''
  newPassword = ''
  confirmPassword = ''
  done = false
  doneMessage = ''

  showTerm = false
  allUserTerms: ITerm[] = []
  userToken = ''
  userApproved!: IUserApproved | null

  loginData: ILoginDto = {
    email: '',
    password: '',
  }

  principalEmail = ''

  seePassword = false
  isLoading = false

  validateEmailData(input: HTMLInputElement) {
    const valid = this.validateService.validateEmailData(
      input.value ? input.value : '',
    )
    this.validateService.colorInput(valid, input)
  }

  validatePasswordData(input: HTMLInputElement) {
    const valid = this.validateService.validatePasswordData(input.value)
    this.validateService.colorInput(valid, input)
  }

  login() {
    this.isLoading = true

    const isValidEmail = this.validateService.validateEmailData(
      this.loginData.email,
    )
    if (!isValidEmail) {
      this.errorMessage = 'Digite um email válido para prosseguir com o login'
      this.error = true
      this.isLoading = false
      return
    }
    const isValidPass = this.validateService.validatePasswordData(
      this.loginData.password,
    )
    if (!isValidPass) {
      this.errorMessage =
        'A senha deve conter pelo menos 8 caracteres, sendo´pelo menos uma letra minúscula, pelo menos uma letra maiúscula, pelo menos um símbolo e pelo menos um número.'
      this.error = true
      this.isLoading = false
      return
    }

    this.loginService.login(this.loginData).subscribe({
      next: (res) => {
        // console.log('primeira res:', res)
        localStorage.setItem('access_token', res.access_token)

        this.loginService.findApprovedUser(res.access_token).subscribe({
          next: (userApproved) => {
            if (userApproved && userApproved.user_approved) {
              if (
                userApproved.terms &&
                userApproved.terms != null &&
                userApproved.terms.length > 0
              ) {
                this.allUserTerms = userApproved.terms
                this.allUserTerms.forEach((term) => {
                  term.dividedText = term.text.split('\n')
                })
                this.userToken = res.access_token
                this.userApproved = userApproved
                this.showTerm = true
                this.isLoading = false
              } else {
                this.loginService.userToken = res.access_token
                this.loginService.addApprovedUser(userApproved)
                this.router.navigateByUrl('/')
              }
            } else {
              throw Error(
                'Seu usuário ainda não foi aprovado pela equipe da coordenação.',
              )
            }
          },
        })
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  confirmLogin(confirm: boolean) {
    if (confirm) {
      this.loginService.userToken = this.userToken
      if (this.userApproved) {
        this.loginService.addApprovedUser(this.userApproved)
        const termsUser: ItermUser[] = this.userApproved?.roles.map((role) => {
          return { role_id: role.role_id, sign: true }
        })
        this.loginService
          .signTerms({ termsUser: termsUser }, this.userToken)
          .subscribe((res) => {
            console.log(res)
          })
      }
      this.showTerm = false
      this.router.navigateByUrl('/')
    } else {
      this.userToken = ''
      this.userApproved = null
      this.showTerm = false
    }
  }

  getPassCode() {
    this.isLoading = true

    const isValidEmail = this.validateService.validateEmailData(
      this.principalEmail,
    )
    if (!isValidEmail) {
      this.errorMessage =
        'Digite um email válido para prosseguir com a recuperação de senha.'
      this.error = true
      this.isLoading = false
      return
    }

    this.loginService.getPassCode(this.principalEmail).subscribe({
      next: (res) => {
        if (res == false) {
          this.errorMessage = 'Aguarde 5 minutos para solicitar novo token'
          this.error = true
          this.isLoading = false
          return
        }
        this.forgot = 2
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  validatePassCode() {
    this.isLoading = true

    const isValidCode = this.validateService.validatePasswordData(
      this.accessCode,
    )
    if (!isValidCode) {
      this.errorMessage = 'Digite o código recebido por email.'
      this.error = true
      this.isLoading = false
      return
    }

    this.loginService
      .comparePassCode(this.principalEmail, this.accessCode)
      .subscribe({
        next: (res) => {
          this.forgot = 3
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  changePassword() {
    this.isLoading = true

    const isvalidPassword = this.validateService.validatePasswordData(
      this.newPassword,
    )
    if (!isvalidPassword) {
      this.errorMessage =
        'A senha deve contar ao menos uma letra maiúscula, uma minúscula, um dígito numério e um símbolo, além de conter pelo menos 8 caracteres.'
      this.error = true
      this.isLoading = false
      return
    }

    if (this.newPassword != this.confirmPassword) {
      this.errorMessage =
        'A nova senha e a confirmação de senha devem ser iguais.'
      this.error = true
      this.isLoading = false
      return
    }

    this.loginService
      .changePassword(this.principalEmail, this.newPassword)
      .subscribe({
        next: (res) => {
          if (res == 2) {
            this.errorMessage = `Você precisa completar o processo em menos de 1 hora. `
            this.error = true
            this.forgot = 0
            this.accessCode = ''
            this.newPassword = ''
            this.confirmPassword = ''
            this.principalEmail = ''
            this.isLoading = false
            return
          } else if (res == 1) {
            this.doneMessage = `Senha alterada com sucesso. Utilize seu email e nova senha para login.`
            this.done = true
            this.forgot = 0
            this.isLoading = false
          }
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  cancel() {
    this.router.navigateByUrl('/')
  }

  showRecover() {
    this.forgot = 1
  }

  closeRecover() {
    this.accessCode = ''
    this.newPassword = ''
    this.confirmPassword = ''
    this.principalEmail = ''
    this.forgot = 0
  }

  insertCode() {
    this.isLoading = true

    const isValidEmail = this.validateService.validateEmailData(
      this.principalEmail,
    )
    if (!isValidEmail) {
      this.errorMessage =
        'Digite um email válido para prosseguir com a recuperação de senha.'
      this.error = true
      this.isLoading = false
      return
    }
    this.forgot = 2
    this.isLoading = false
  }

  showPassword() {
    this.seePassword = !this.seePassword

    const passwordInput = document.getElementById(
      'senhaInput',
    ) as HTMLInputElement
    if (this.seePassword) {
      passwordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
    }
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
