import { Component, Input, OnInit } from '@angular/core'
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
export class SpEndowmentsComponent implements OnInit {
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
    this.endowmentTypeList = []
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
        this.endowmentTypeList = []
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
      next: () => {
        this.ngOnInit()
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
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
