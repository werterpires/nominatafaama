import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { AcademicDegreeService } from '../academic-degrees/academic-degrees.service'
import { IAcademicDegree } from '../academic-degrees/types'
import { SpAcademicFormationsService } from './sp-academic-formmations.service'
import {
  ISpAcademicFormation,
  ISpCreateAcademicFormation,
  ISpUpdateAcademicFormation,
} from './types'

@Component({
  selector: 'app-sp-academic-formations',
  templateUrl: './sp-academic-formmations.component.html',
  styleUrls: ['./sp-academic-formmations.component.css'],
})
export class SpAcademicFormmationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: ISpAcademicFormation[] = []
  spAllDegrees: IAcademicDegree[] = []
  title = 'Formações Acadêmicas do Cônjuge'
  createRegistryData: ISpCreateAcademicFormation = {
    begin_date: '',
    conclusion_date: '',
    course_area: '',
    degree_id: 0,
    institution: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: SpAcademicFormationsService,
    private academicDegreeService: AcademicDegreeService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.getAllDecrees()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
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

  getAllDecrees() {
    this.isLoading = true
    this.academicDegreeService.findAllRegistries().subscribe({
      next: (res) => {
        this.spAllDegrees = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  resetCreationRegistry() {
    Object.keys(this.createRegistryData).forEach((key) => {
      switch (typeof key) {
        case 'boolean':
          Object.defineProperty(this.createRegistryData, key, { value: false })
          break
        case 'number':
          Object.defineProperty(this.createRegistryData, key, { value: 0 })
          break
        case 'string':
          Object.defineProperty(this.createRegistryData, key, { value: '' })
          break
      }
    })
  }

  createRegistry() {
    this.isLoading = true

    if (this.createRegistryData.degree_id < 1) {
      this.showError('Insira um grau acadêmico para prosseguir com o registro.')
      return
    }

    if (this.createRegistryData.course_area.length < 2) {
      this.showError(
        'Insira uma área de formação para prosseguir com o registro.',
      )
      return
    }

    if (this.createRegistryData.institution.length < 2) {
      this.showError('Insira uma instituição para prosseguir com o registro.')
      return
    }

    if (this.createRegistryData.begin_date.length < 2) {
      this.showError(
        'Insira uma data de início para prosseguir com o registro.',
      )
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        degree_id: parseInt(this.createRegistryData.degree_id.toString()),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.getAllRegistries()
          this.showForm = false
          this.resetCreationRegistry()
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(index: number, buttonId: string) {
    this.isLoading = true

    if (this.allRegistries[index].degree_id < 1) {
      this.showError('Insira um grau acadêmico para prosseguir com o registro.')
      return
    }

    if (this.allRegistries[index].course_area.length < 2) {
      this.showError(
        'Insira uma área de formação para prosseguir com o registro.',
      )
      return
    }

    if (this.allRegistries[index].institution.length < 2) {
      this.showError('Insira uma instituição para prosseguir com o registro.')
      return
    }

    if (this.allRegistries[index].begin_date.length < 2) {
      this.showError(
        'Insira uma data de início para prosseguir com o registro.',
      )
      return
    }

    const newRegistry: Partial<ISpAcademicFormation> = {
      ...this.allRegistries[index],
      formation_id: parseInt(this.allRegistries[index].formation_id.toString()),
      degree_id: parseInt(this.allRegistries[index].degree_id.toString()),
    }

    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.person_id
    delete newRegistry.academic_formation_approved
    delete newRegistry.degree_name

    this.service
      .updateRegistry(newRegistry as ISpUpdateAcademicFormation)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true
          document.getElementById(buttonId)?.classList.add('hidden')
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  deleteRegistry(id: number) {
    this.isLoading = true
    this.service.deleteRegistry(id).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível remover o registro.'
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
