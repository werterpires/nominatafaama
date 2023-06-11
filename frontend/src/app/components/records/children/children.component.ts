import { Component, Input } from '@angular/core'
import { CreateChildDto, IChild, UpdateChildDto } from './types'
import { IMaritalStatus } from '../marital-status/types'
import { ChildrenService } from './achildren.service'
import { MaritalStatusService } from '../marital-status/marital-status.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { IPermissions } from '../../shared/container/types'

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
})
export class ChildrenComponent {
  @Input() permissions!: IPermissions

  allRegistries: IChild[] = []
  allTypes: IMaritalStatus[] = []
  title = 'Filhos'
  createRegistryData: CreateChildDto = {
    child_birth_date: '',
    cpf: '',
    marital_status_id: 0,
    name: '',
    study_grade: '',
  }
  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: ChildrenService,
    private maritalStatusService: MaritalStatusService,
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
        this.getMaritalStatusTypes()
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
        this.getMaritalStatusTypes()
      },
    })
  }

  getMaritalStatusTypes() {
    this.maritalStatusService.findAllRegistries().subscribe({
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
        child_birth_date: this.dataService.dateFormatter(
          this.createRegistryData.child_birth_date,
        ),
        marital_status_id: parseInt(
          this.createRegistryData.marital_status_id.toString(),
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

    const updateRegistry: Partial<IChild> = {
      ...this.allRegistries[index],
      child_birth_date: this.dataService.dateFormatter(
        this.allRegistries[index].child_birth_date,
      ),
      marital_status_id: parseInt(
        this.allRegistries[index].marital_status_id.toString(),
      ),
      person_id: parseInt(this.allRegistries[index].person_id.toString()),
    }

    delete updateRegistry.child_approved
    delete updateRegistry.created_at
    delete updateRegistry.updated_at
    delete updateRegistry.marital_status_type_name

    this.service.updateRegistry(updateRegistry as UpdateChildDto).subscribe({
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
