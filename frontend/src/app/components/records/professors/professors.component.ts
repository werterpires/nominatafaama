import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ICity, IUF } from '../../shared/types'
import { AssociationService } from '../associations/associations.service'
import { IAssociation } from '../associations/types'
import { HiringStatusService } from '../hiring-status/hiring_status.service'
import { IHiringStatus } from '../hiring-status/types'
import { MaritalStatusService } from '../marital-status/marital-status.service'
import { IMaritalStatus } from '../marital-status/types'
import { ProfessorsService } from './professors.service'
import { OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'
import {
  ICreateProfessorAssignment,
  IProfessor,
  IUpdateProfessorAssignment,
} from './types'

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css'],
})
export class ProfessorsComponent {
  constructor(
    private professorsService: ProfessorsService,
    private othersService: OthersServices,
    private dataService: DataService,
    private validateService: ValidateService,
  ) {}
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef

  @Input() permissions!: IPermissions
  registry: IProfessor = {
    approved: null,
    assignments: '',
    created_at: '',
    person_id: 0,
    person_name: '',
    professor_id: 0,
    professor_photo_address: '',
    updated_at: '',
  }

  title = 'Dados do professor'

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
    this.professorsService.findRegistry().subscribe({
      next: (res) => {
        if (res && res.professor_id) {
          this.registry = res
        } else {
          this.showBox = true
          this.showForm = true
        }
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  createRegistry() {
    this.isLoading = true

    if (this.registry.assignments.length < 1) {
      this.showError('Escreva sua titulação para prosseguir com o registro.')
      return
    }

    const newProfessor: ICreateProfessorAssignment = {
      assignments: this.registry.assignments,
    }

    this.professorsService.createProfessorAssignment(newProfessor).subscribe({
      next: (res) => {
        this.doneMessage = 'Dados gravados com sucesso.'
        this.done = true
        this.isLoading = false
        this.getRegistry()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível gravar dos dados.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  editRegistry() {
    this.isLoading = true

    if (this.registry.assignments.length < 1) {
      this.showError('Informe sua titulação para proceder com a edição.')
      return
    }

    const editProfessorData: IUpdateProfessorAssignment = {
      assignments: this.registry.assignments,
      professor_id: this.registry.professor_id,
    }

    this.professorsService.updateProfessor(editProfessorData).subscribe({
      next: (res) => {
        this.doneMessage = 'Dados editados com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível atualizar os dados.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
