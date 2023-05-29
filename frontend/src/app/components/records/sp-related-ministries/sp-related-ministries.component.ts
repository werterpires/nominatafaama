import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { MinistryTypesService } from '../minstry-types/ministry-types.service'
import { IMinistryType } from '../minstry-types/types'
import {
  IRelatedMinistry,
  CreateRelatedMinistryDto,
  UpdateRelatedMinistryDto,
} from '../related-ministries/types'
import { SpRelatedMinistriesService } from './sp-related-ministries.service'

@Component({
  selector: 'app-sp-related-ministries',
  templateUrl: './sp-related-ministries.component.html',
  styleUrls: ['./sp-related-ministries.component.css'],
})
export class SpRelatedMinistriesComponent {
  @Input() permissions!: IPermissions

  allRegistries: IRelatedMinistry[] = []
  ministryTypeList: Array<IMinistryType> = []
  title = 'Ministérios de interesse'
  createRegistryData: CreateRelatedMinistryDto = {
    ministry_type_id: 0,
    priority: 0,
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: SpRelatedMinistriesService,
    private ministryTypesService: MinistryTypesService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.getAllLanguageTypes()
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

  getAllLanguageTypes() {
    this.isLoading = true
    this.ministryTypesService.findAllRegistries().subscribe({
      next: (res) => {
        this.ministryTypeList = res
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
        ministry_type_id: parseInt(
          this.createRegistryData.ministry_type_id.toString(),
        ),
        priority: parseInt(this.createRegistryData.priority.toString()),
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

    const newRegistry: Partial<IRelatedMinistry> = {
      ...this.allRegistries[index],
      ministry_type_id: parseInt(
        this.allRegistries[index].ministry_type_id.toString(),
      ),
      priority: parseInt(this.allRegistries[index].priority.toString()),
    }
    delete newRegistry.related_ministry_approved
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.ministry_type_name

    this.service
      .updateRegistry(newRegistry as UpdateRelatedMinistryDto)
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
