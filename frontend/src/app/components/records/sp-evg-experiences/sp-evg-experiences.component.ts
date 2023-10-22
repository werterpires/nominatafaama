import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { EvangExpTypesService } from '../../parameterization/evang-exp-types/evang-exp-types.service'
import { IEvangExpType } from '../../parameterization/evang-exp-types/types'
import {
  IEvangelisticExperience,
  CreateEvangelisticExperienceDto,
  UpdateEvangelisticExperienceDto,
} from '../evg-experiences/types'
import { SpEvgExperiencesService } from './sp-evg-experiences.service'

@Component({
  selector: 'app-sp-evg-experiences',
  templateUrl: './sp-evg-experiences.component.html',
  styleUrls: ['./sp-evg-experiences.component.css'],
})
export class SpEvgExperiencesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: IEvangelisticExperience[] = []
  allTypes: IEvangExpType[] = []
  title =
    'Experiências evangelísticas do Cônjuge durante a formação ministerial no SALT'
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
    private service: SpEvgExperiencesService,
    private expTypService: EvangExpTypesService,
    private dataService: DataService,
  ) {}

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
    this.allTypes = []
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
        this.allTypes = []
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
        next: () => {
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

  editRegistry(index: number) {
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
