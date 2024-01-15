import { Component, Input, OnInit } from '@angular/core'
import { IPermissions, IUserApproved } from '../../shared/container/types'
import { IFieldRepresentation } from '../../records/representations/types'

import { DataService } from '../../shared/shared.service.ts/data.service'
import { LoginService } from '../../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'
import { OneRepresentationToApproveService } from './one-representation-to-approve.service'
import { IFieldRep } from '../../records/field-reps/types'

@Component({
  selector: 'app-one-representation-to-approve',
  templateUrl: './one-representation-to-approve.component.html',
  styleUrls: ['./one-representation-to-approve.component.css'],
})
export class OneRepresentationsToApproveComponent implements OnInit {
  constructor(
    private representationsToApproveService: OneRepresentationToApproveService,
    private dataService: DataService,
    private loginService: LoginService,
    private router: Router,
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
  errorMessage = ''

  allRegistries: IFieldRepresentation[] = []
  user: IUserApproved | null = null

  allReps: IFieldRep[] = []
  selectedRep = 0

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
    this.getAllReps()
  }

  getAllReps() {
    this.isLoading = true
    this.representationsToApproveService.findAllReps().subscribe({
      next: (res) => {
        this.allReps = []
        this.allReps = res

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllRegistries() {
    this.isLoading = true
    this.representationsToApproveService
      .findAllRegistries(this.selectedRep)
      .subscribe({
        next: (res) => {
          this.allRegistries = res

          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  approveRepresentation(
    approveRadio: string,
    rejectRadio: string,
    representationID: number,
    idx: number,
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

    const date = this.dataService.dateFormatter(
      this.allRegistries[idx].repActiveValidate,
    )

    this.representationsToApproveService
      .approveRepresentation({
        representationID,
        repApproved: approved,
        repActiveValidate: date,
      })
      .subscribe({
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
