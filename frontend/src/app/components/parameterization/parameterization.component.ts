import { Component, Input, OnInit } from '@angular/core'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'
import { NominatasService } from './nominatas/nominatas.service'
import { IAssociation } from './associations/types'
import { AssociationService } from './associations/associations.service'

@Component({
  selector: 'app-parameterization',
  templateUrl: './parameterization.component.html',
  styleUrls: ['./parameterization.component.css'],
})
export class ParameterizationComponent implements OnInit {
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
  errorMessage = ''
  error = false

  user: IUserApproved | null = null
  shortNominatas: { nominataId: number; year: string }[] = []
  allAssociations: IAssociation[] = []

  constructor(
    private loginService: LoginService,
    private router: Router,
    private nominataService: NominatasService,
    private associationsService: AssociationService,
  ) {}

  ngOnInit() {
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
          !roles.includes('design')
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
    })

    this.getShortNominatas()
    this.getAllAssociations()
  }

  getShortNominatas() {
    this.isLoading = true
    this.nominataService.findAllNominataYearsRegistries().subscribe({
      next: (res) => {
        this.shortNominatas = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllAssociations() {
    this.isLoading = true
    this.associationsService.findAllRegistries().subscribe({
      next: (res) => {
        this.allAssociations = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
}
