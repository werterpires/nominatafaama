import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import {
  CreateProfessionalExperienceDto,
  IProfessionalExperience,
  UpdateProfessionalExperienceDto,
} from '../professional-experiences/types'
import { SpProfessionalExperiencesService } from './sp-professional-experiences.service'

@Component({
  selector: 'app-sp-professional-experiences',
  templateUrl: './sp-professional-experiences.component.html',
  styleUrls: ['./sp-professional-experiences.component.css'],
})
export class SpProfessionalExperiencesComponent {
  @Input() permissions!: IPermissions

  allRegistries: IProfessionalExperience[] = []
  title = 'Experiências profissionais do Cônjuge'
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
    private service: SpProfessionalExperiencesService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.allRegistries = []
    this.getAllRegistries()
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
        next: (res) => {
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

  editRegistry(index: number, buttonId: string) {
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
        next: (res) => {
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
      next: (res) => {
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
