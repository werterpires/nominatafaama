import { Component, Input } from '@angular/core'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { DataService } from '../shared/shared.service.ts/data.service'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'
import { RecordsService } from './records.service'
import { ErrorServices } from '../shared/shared.service.ts/error.service'

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
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

  user: IUserApproved | null = null

  error = false

  ngOnInit(): void {
    this.loginService.user$.subscribe((user) => {
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
    })
    this.errorService.error$.subscribe((error) => {
      this.error = error
    })
    this.getMaritalStatus()
  }

  getMaritalStatus() {
    // this.isLoading = true;
    this.service.getStudentMaritalStatus().subscribe({
      next: (res) => {
        if (res) {
          this.dataService.maritalStatusName = res.marital_status_type_name
        }
      },
      error: (err) => {
        this.errorService.showError(err.message)
      },
    })
  }
  constructor(
    public dataService: DataService,
    private loginService: LoginService,
    private router: Router,
    private service: RecordsService,
    private errorService: ErrorServices,
  ) {}
}
