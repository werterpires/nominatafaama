import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { EvangExpTypesService } from './evang-exp-types.service'
import {
  ICreateEvangExpTypeDto,
  IEvangExpType,
  IUpdateEvangExpType,
} from './types'

@Component({
  selector: 'app-evang-exp-types',
  templateUrl: './evang-exp-types.component.html',
  styleUrls: ['./evang-exp-types.component.css'],
})
export class EvangExpTypesComponent {
  @Input() permissions!: IPermissions

  allRegistries: IEvangExpType[] = []
  title = 'Tipos de Experiências Evangelísticas'
  createRegistryData: ICreateEvangExpTypeDto = {
    evang_exp_type_name: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(private service: EvangExpTypesService) {}

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

    const newRegistry: Partial<IEvangExpType> = {
      ...this.allRegistries[index],
      evang_exp_type_id: parseInt(
        this.allRegistries[index].evang_exp_type_id.toString(),
      ),
    }

    delete newRegistry.created_at
    delete newRegistry.updated_at

    this.service.updateRegistry(newRegistry as IUpdateEvangExpType).subscribe({
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
