import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
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
  title = 'Experiências Evangelísitcas'
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
        this.getEvgExpTypes()
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
        this.getEvgExpTypes()
      },
    })
  }

  getEvgExpTypes() {
    this.expTypService.findAllEvangExpTypes().subscribe({
      next: (res) => {
        this.allTypes = res
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
        evang_exp_type_id: parseInt(
          this.createRegistryData.evang_exp_type_id.toString(),
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

    const updateRegistry: Partial<IEvangelisticExperience> = {
      ...this.allRegistries[index],
      evang_exp_type_id: parseInt(
        this.allRegistries[index].evang_exp_type_id.toString(),
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
