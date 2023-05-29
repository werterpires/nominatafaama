import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { CreateUnionDto, IUnion, UpdateUnionDto } from './types'
import { UnionService } from './unions.service'

@Component({
  selector: 'app-unions',
  templateUrl: './unions.component.html',
  styleUrls: ['./unions.component.css'],
})
export class UnionsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IUnion[] = []
  title = 'Uniões'
  createRegistryData: CreateUnionDto = {
    union_acronym: '',
    union_name: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(private service: UnionService) {}

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
    this.service.createRegistry(this.createRegistryData).subscribe({
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

    const newRegistry: UpdateUnionDto = {
      union_acronym: this.allRegistries[index].union_acronym,
      union_name: this.allRegistries[index].union_name,
      union_id: parseInt(this.allRegistries[index].union_id.toString()),
    }

    this.service.updateRegistry(newRegistry).subscribe({
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
