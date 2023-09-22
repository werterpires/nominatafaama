import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { EndowmentTypesService } from '../../parameterization/endowment-types/endowment-types.service'
import { IEndowmentType } from '../../parameterization/endowment-types/types'
import {
  IEndowment,
  CreateEndowmentDto,
  UpdateEndowmentDto,
} from '../endowments/types'
import { SpEndowmentsService } from './sp-endowments.service'

@Component({
  selector: 'app-sp-endowments',
  templateUrl: './sp-endowments.component.html',
  styleUrls: ['./sp-endowments.component.css'],
})
export class SpEndowmentsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IEndowment[] = []
  endowmentTypeList: Array<IEndowmentType> = []
  title = 'Investiduras obtidas pelo Cônjuge'
  createRegistryData: CreateEndowmentDto = {
    endowment_type_id: 0,
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: SpEndowmentsService,
    private endowmentsServices: EndowmentTypesService,
  ) {}

  ngOnInit() {
    this.allRegistries = []
    this.endowmentTypeList = []
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
        this.getAllEndowmentTypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllEndowmentTypes() {
    this.isLoading = true
    this.endowmentsServices.findAllRegistries().subscribe({
      next: (res) => {
        this.endowmentTypeList = res
        this.filtertypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  filtertypes() {
    const TypeIds = this.allRegistries.map((item) => item.endowment_type_id)
    this.endowmentTypeList.forEach((item) => {
      if (TypeIds.includes(item.endowment_type_id)) {
        item.used = true
      }
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
        endowment_type_id: parseInt(
          this.createRegistryData.endowment_type_id.toString(),
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
    const newRegistry: Partial<IEndowment> = {
      ...this.allRegistries[index],
      endowment_type_id: parseInt(
        this.allRegistries[index].endowment_type_id.toString(),
      ),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.application
    delete newRegistry.endowment_approved
    delete newRegistry.endowment_type_name

    this.service.updateRegistry(newRegistry as UpdateEndowmentDto).subscribe({
      next: (res) => {
        this.ngOnInit()
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
        document.getElementById(buttonId)?.classList.add('hidden')
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
