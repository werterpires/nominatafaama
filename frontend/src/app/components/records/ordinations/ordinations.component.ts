import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { CreateOrdinationDto, IOrdination, UpdateOrdinationDto } from './types'
import { OrdinationsService } from './ordinations.service'

@Component({
  selector: 'app-ordinations',
  templateUrl: './ordinations.component.html',
  styleUrls: ['./ordinations.component.css'],
})
export class OrdinationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IOrdination[] = []
  title = 'Ordenações Recebidas pelo formando'
  createRegistryData: CreateOrdinationDto = {
    ordination_name: '',
    place: '',
    year: null,
  }

  types = ['Ancionato', 'Diaconato']

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(private service: OrdinationsService) {}

  ngOnInit() {
    this.allRegistries = []
    this.types = ['Ancionato', 'Diaconato']
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
        this.filterTypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  filterTypes() {
    const TypeIds = this.allRegistries.map((item) => item.ordination_name)
    this.types = this.types.filter((item) => !TypeIds.includes(item))
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

    if (this.createRegistryData.ordination_name.length < 1) {
      this.showError('Selecione uma ordenação.')
      return
    }

    if (this.createRegistryData.place.length < 1) {
      this.showError('Informe o local de ordenação.')
      return
    }

    if (this.createRegistryData.year == null) {
      this.showError('Insira um ano válido para a ordenação.')
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        year: parseInt(this.createRegistryData.year.toString()),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.createRegistryData = {
            ordination_name: '',
            place: '',
            year: null,
          }
          this.ngOnInit()
          this.showForm = false
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

    if (this.allRegistries[index].ordination_name.length < 1) {
      this.showError('Selecione uma ordenação.')
      return
    }

    if (this.allRegistries[index].place.length < 1) {
      this.showError('Informe o local de ordenação.')
      return
    }

    if (this.allRegistries[index].year == null) {
      this.showError('Insira um ano válido para a ordenação.')
      return
    }

    const newRegistry: Partial<IOrdination> = {
      ...this.allRegistries[index],
      year: parseInt(this.allRegistries[index].year.toString()),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.ordination_approved

    this.service.updateRegistry(newRegistry as UpdateOrdinationDto).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
        document.getElementById(buttonId)?.classList.add('hidden')
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

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
