import { Component, Input } from '@angular/core'
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
export class ProfessionalExperiencesComponent {
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

  ngOnInit() {
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
    this.service
      .createRegistry({
        ...this.createRegistryData,
        job_begin_date: this.dataService.dateFormatter(
          this.createRegistryData.job_begin_date,
        ),
        job_end_date: this.dataService.dateFormatter(
          this.createRegistryData.job_begin_date,
        ),
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
    const newRegistry: Partial<IProfessionalExperience> = {
      ...this.allRegistries[index],
      job_begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].job_begin_date,
      ),
      job_end_date: this.dataService.dateFormatter(
        this.allRegistries[index].job_begin_date,
      ),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.experience_approved

    console.log(newRegistry)

    this.service
      .updateRegistry(newRegistry as UpdateProfessionalExperienceDto)
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

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}