import { Component, Input } from '@angular/core'
import { CreateChildDto, IChild, UpdateChildDto } from './types'
import { IMaritalStatus } from '../marital-status/types'
import { ChildrenService } from './children.service'
import { MaritalStatusService } from '../marital-status/marital-status.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { IPermissions } from '../../shared/container/types'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'

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
    private validateService: ValidateService,
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
        this.formatarCPFs()
        this.getMaritalStatusTypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.getMaritalStatusTypes()
        this.isLoading = false
      },
    })
  }

  getMaritalStatusTypes() {
    this.maritalStatusService.findAllRegistries().subscribe({
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

  formatarCPFs() {
    this.allRegistries.forEach((registry) => {
      let formattedCPF = ''
      registry.cpf = registry.cpf.replace(/\D/g, '')

      if (registry.cpf.length > 3) {
        formattedCPF = registry.cpf.replace(/(\d{3})/, '$1.')
      }
      if (registry.cpf.length > 6) {
        formattedCPF = registry.cpf.replace(/(\d{3})(\d{3})/, '$1.$2.')
      }
      if (registry.cpf.length > 9) {
        formattedCPF = registry.cpf.replace(
          /(\d{3})(\d{3})(\d{3})/,
          '$1.$2.$3-',
        )
      }
      registry.cpf = formattedCPF
    })
  }

  formatarCPF() {
    let formattedCPF = ''
    this.createRegistryData.cpf = this.createRegistryData.cpf.replace(/\D/g, '')

    if (this.createRegistryData.cpf.length > 3) {
      formattedCPF = this.createRegistryData.cpf.replace(/(\d{3})/, '$1.')
    }
    if (this.createRegistryData.cpf.length > 6) {
      formattedCPF = this.createRegistryData.cpf.replace(
        /(\d{3})(\d{3})/,
        '$1.$2.',
      )
    }
    if (this.createRegistryData.cpf.length > 9) {
      formattedCPF = this.createRegistryData.cpf.replace(
        /(\d{3})(\d{3})(\d{3})/,
        '$1.$2.$3-',
      )
    }
    this.createRegistryData.cpf = formattedCPF
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

    if (this.createRegistryData.name.length < 1) {
      this.showError('Informe o nome do filho.')
      return
    }

    if (!this.validateService.validateCpfData(this.createRegistryData.cpf)) {
      this.showError('Informe um CPF válido para continuar.')
      return
    }

    if (this.createRegistryData.child_birth_date.length != 10) {
      this.showError('Informe uma data de nascimento para continuar.')
      return
    }

    if (this.createRegistryData.study_grade.length < 1) {
      this.showError(
        'Informe a série escolar do filho. Se ainda não estuda ou se já não estuda mais, insira essa informação.',
      )
      return
    }

    if (this.createRegistryData.marital_status_id < 1) {
      this.showError('Informe o estado civil do filho')
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        child_birth_date: this.dataService.dateFormatter(
          this.createRegistryData.child_birth_date,
        ),
        marital_status_id: parseInt(
          this.createRegistryData.marital_status_id.toString(),
        ),
        cpf: this.createRegistryData.cpf.replace(/[^\d]/g, ''),
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

    if (this.allRegistries[index].name.length < 1) {
      this.showError('Informe o nome do filho.')
      return
    }

    if (!this.validateService.validateCpfData(this.allRegistries[index].cpf)) {
      this.showError('Informe um CPF válido para continuar.')
      return
    }

    if (this.allRegistries[index].child_birth_date.length != 10) {
      this.showError('Informe uma data de nascimento para continuar.')
      return
    }

    if (this.allRegistries[index].study_grade.length < 1) {
      this.showError(
        'Informe a série escolar do filho. Se ainda não estuda ou se já não estuda mais, insira essa informação.',
      )
      return
    }

    if (this.allRegistries[index].marital_status_id < 1) {
      this.showError('Informe o estado civil do filho')
      return
    }

    const updateRegistry: Partial<IChild> = {
      ...this.allRegistries[index],
      child_birth_date: this.dataService.dateFormatter(
        this.allRegistries[index].child_birth_date,
      ),
      marital_status_id: parseInt(
        this.allRegistries[index].marital_status_id.toString(),
      ),
      person_id: parseInt(this.allRegistries[index].person_id.toString()),
      cpf: this.allRegistries[index].cpf.replace(/[^\d]/g, ''),
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
