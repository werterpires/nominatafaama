import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  CreateProfessionalExperienceDto,
  IProfessionalExperience,
  UpdateProfessionalExperienceDto,
} from './types'
import { ProfessionalExperiencesService } from './professional-experiences.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-professional-experiences',
  templateUrl: './professional-experiences.component.html',
  styleUrls: ['./professional-experiences.component.css'],
})
export class ProfessionalExperiencesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: IProfessionalExperience[] = []
  title = 'Experiências profissionais'
  createRegistryData: CreateProfessionalExperienceDto = {
    job: '',
    job_begin_date: '',
    job_end_date: '',
    job_institution: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: ProfessionalExperiencesService,
    private dataService: DataService,
  ) {}

  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null

  showAlert(func: string, message: string, idx?: number) {
    if (idx) {
      this.index = idx
    }
    this.func = func
    this.alertMessage = message
    this.alert = true
  }

  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível editar.'
        this.error = true
        this.resetAlert()
        return
      }
      this.editRegistry(this.index)
      this.resetAlert()
    } else if (func == 'delete') {
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível deletar.'
        this.error = true
        this.resetAlert()
        return
      }
      this.deleteRegistry(this.index)
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
    this.allRegistries = []
    if (this.showBox) {
      this.getAllRegistries()
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getAllRegistries()
    } else if (!this.showBox) {
      this.allRegistries = []
    }
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

    if (this.createRegistryData.job.length < 1) {
      this.showError('Informe o trabalho desempenhado.')
      return
    }

    if (this.createRegistryData.job_institution.length < 1) {
      this.showError(
        'Informe a instituição, empresa ou o nome do seu patrão, caso seja uma pessoa física.',
      )
      return
    }

    if (this.createRegistryData.job_begin_date.length != 10) {
      this.showError('Informe a data de início da experiência profissional.')
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        job_begin_date: this.dataService.dateFormatter(
          this.createRegistryData.job_begin_date,
        ),
        job_end_date: this.createRegistryData.job_end_date
          ? this.dataService.dateFormatter(this.createRegistryData.job_end_date)
          : null,
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          this.resetCreationRegistry()
          this.showForm = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(index: number) {
    this.isLoading = true

    if (this.allRegistries[index].job.length < 1) {
      this.showError('Informe o trabalho desempenhado.')
      return
    }

    if (this.allRegistries[index].job_institution.length < 1) {
      this.showError(
        'Informe a instituição, empresa ou o nome do seu patrão, caso seja uma pessoa física.',
      )
      return
    }

    if (this.allRegistries[index].job_begin_date.length != 10) {
      this.showError('Informe a data de início da experiência profissional.')
      return
    }

    const newRegistry: Partial<IProfessionalExperience> = {
      ...this.allRegistries[index],
      job_begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].job_begin_date,
      ),
      job_end_date: this.allRegistries[index].job_end_date
        ? this.dataService.dateFormatter(
            this.allRegistries[index].job_end_date || '',
          )
        : null,
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.experience_approved

    this.service
      .updateRegistry(newRegistry as UpdateProfessionalExperienceDto)
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true
          this.ngOnInit()
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

  deleteRegistry(id: number) {
    this.isLoading = true
    this.service.deleteRegistry(id).subscribe({
      next: () => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
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
