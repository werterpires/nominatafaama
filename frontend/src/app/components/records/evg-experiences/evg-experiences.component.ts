import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { EvangExpTypesService } from '../evang-exp-types/evang-exp-types.service'
import { IEvangExpType } from '../evang-exp-types/types'
import { EvgExperiencesService } from './evg-experiences.service'
import {
  CreateEvangelisticExperienceDto,
  IEvangelisticExperience,
  UpdateEvangelisticExperienceDto,
} from './types'

@Component({
  selector: 'app-evg-experiences',
  templateUrl: './evg-experiences.component.html',
  styleUrls: ['./evg-experiences.component.css'],
})
export class EvgExperiencesComponent {
  @Input() permissions!: IPermissions

  allRegistries: IEvangelisticExperience[] = []
  allTypes: IEvangExpType[] = []
  title = 'Experiências evangelísticas durante a formação ministerial no SALT'
  createRegistryData: CreateEvangelisticExperienceDto = {
    evang_exp_type_id: 0,
    exp_begin_date: '',
    exp_end_date: '',
    place: '',
    project: '',
  }
  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: EvgExperiencesService,
    private expTypService: EvangExpTypesService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.allRegistries = []
    this.allTypes = []
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
        this.getEvgExpTypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.getEvgExpTypes()
        this.isLoading = false
      },
    })
  }

  getEvgExpTypes() {
    this.expTypService.findAllRegistries().subscribe({
      next: (res) => {
        this.allTypes = res
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

    if (this.createRegistryData.evang_exp_type_id < 1) {
      this.showError('Informe o tipo de experiência evangelística.')
      return
    }

    if (this.createRegistryData.project.length < 1) {
      this.showError('Informe nome do projeto em que esteve envolvido.')
      return
    }

    if (this.createRegistryData.place.length < 1) {
      this.showError('Informe o local onde o projeto aconteceu.')
      return
    }

    if (this.createRegistryData.exp_begin_date.length != 10) {
      this.showError('Informe a data em que você foi inserido no projeto.')
      return
    }

    if (this.createRegistryData.exp_end_date.length != 10) {
      this.showError('Informe a data em que você concluiu o projeto.')
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        evang_exp_type_id: parseInt(
          this.createRegistryData.evang_exp_type_id.toString(),
        ),
        exp_begin_date: this.dataService.dateFormatter(
          this.createRegistryData.exp_begin_date,
        ),
        exp_end_date: this.dataService.dateFormatter(
          this.createRegistryData.exp_end_date,
        ),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.ngOnInit()
          this.showForm = false
          this.resetCreationRegistry()
          this.isLoading = false
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

    if (this.allRegistries[index].evang_exp_type_id < 1) {
      this.showError('Informe o tipo de experiência evangelística.')
      return
    }

    if (this.allRegistries[index].project.length < 1) {
      this.showError('Informe nome do projeto em que esteve envolvido.')
      return
    }

    if (this.allRegistries[index].place.length < 1) {
      this.showError('Informe o local onde o projeto aconteceu.')
      return
    }

    if (this.allRegistries[index].exp_begin_date.length != 10) {
      this.showError('Informe a data em que você foi inserido no projeto.')
      return
    }

    if (this.allRegistries[index].exp_end_date.length != 10) {
      this.showError('Informe a data em que você concluiu o projeto.')
      return
    }

    const updateRegistry: Partial<IEvangelisticExperience> = {
      ...this.allRegistries[index],
      evang_exp_type_id: parseInt(
        this.allRegistries[index].evang_exp_type_id.toString(),
      ),
      exp_begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].exp_begin_date,
      ),
      exp_end_date: this.dataService.dateFormatter(
        this.allRegistries[index].exp_end_date,
      ),
    }

    delete updateRegistry.person_id
    delete updateRegistry.evang_exp_approved
    delete updateRegistry.created_at
    delete updateRegistry.updated_at
    delete updateRegistry.evang_exp_type_name

    this.service
      .updateRegistry(updateRegistry as UpdateEvangelisticExperienceDto)
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
