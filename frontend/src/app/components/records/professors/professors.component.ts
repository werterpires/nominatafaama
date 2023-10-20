import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ProfessorsService } from './professors.service'
import { ElementRef, ViewChild } from '@angular/core'
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
export class ProfessorsComponent implements OnInit {
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

  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null

  showAlert(func: string, message: string, idx?: number) {
    this.index = idx ?? this.index
    this.func = func
    this.alertMessage = message
    this.alert = true
  }

  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      this.editRegistry()
      this.resetAlert()
    } else if (func == 'create') {
      this.createRegistry()
      this.resetAlert()
    }
  }

  resetAlert() {
    this.index = null
    this.func = ''
    this.alertMessage = ''
    this.alert = false
  }

  ngOnInit() {
    if (this.showBox) {
      this.getRegistry()
    }
    if (this.registry.person_id == null) {
      this.showForm = false
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getRegistry()
    } else if (!this.showBox) {
      this.registry = {
        approved: null,
        assignments: '',
        created_at: '',
        person_id: 0,
        person_name: '',
        professor_id: 0,
        professor_photo_address: '',
        updated_at: '',
      }
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
      next: () => {
        this.doneMessage = 'Dados gravados com sucesso.'
        this.done = true
        this.isLoading = false
        this.getRegistry()
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

    if (this.registry.assignments.length < 1) {
      this.showError('Informe sua titulação para proceder com a edição.')
      return
    }

    const editProfessorData: IUpdateProfessorAssignment = {
      assignments: this.registry.assignments,
      professor_id: this.registry.professor_id,
    }

    this.professorsService.updateProfessor(editProfessorData).subscribe({
      next: () => {
        this.doneMessage = 'Dados editados com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
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
