import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  CreateRelatedMinistryDto,
  IRelatedMinistry,
  UpdateRelatedMinistryDto,
} from './types'
import { IMinistryType } from '../../parameterization/minstry-types/types'
import { RelatedMinistriesService } from './related-ministries.service'
import { MinistryTypesService } from '../../parameterization/minstry-types/ministry-types.service'

@Component({
  selector: 'app-related-ministries',
  templateUrl: './related-ministries.component.html',
  styleUrls: ['./related-ministries.component.css'],
})
export class RelatedMinistriesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: IRelatedMinistry[] = []
  ministryTypeList: Array<IMinistryType> = []
  title = 'Ministérios de interesse'
  createRegistryData: CreateRelatedMinistryDto[] = [
    {
      ministry_type_id: 0,
      priority: 0,
    },
    {
      ministry_type_id: 0,
      priority: 0,
    },
    {
      ministry_type_id: 0,
      priority: 0,
    },
  ]

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: RelatedMinistriesService,
    private ministryTypesService: MinistryTypesService,
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
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível Criar o registro.'
        this.error = true
        this.resetAlert()
        return
      }
      this.createRegistry(this.index)
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
        this.ministryTypeList = []
        this.getAllTypes()

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllTypes() {
    this.isLoading = true
    this.ministryTypesService.findAllRegistries().subscribe({
      next: (res) => {
        this.ministryTypeList = res
        this.filterMinistriesByType()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  filterMinistriesByType() {
    const ministryTypeIds = this.allRegistries.map(
      (item) => item.ministry_type_id,
    )
    this.ministryTypeList.forEach((item) => {
      if (ministryTypeIds.includes(item.ministry_type_id)) {
        item.used = true
      }
    })
  }

  createRegistry(priority: number) {
    this.isLoading = true
    this.service
      .createRegistry({
        ministry_type_id: parseInt(
          this.createRegistryData[priority].ministry_type_id.toString(),
        ),
        priority: priority + 1,
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ministryTypeList = []
          this.createRegistryData = [
            {
              ministry_type_id: 0,
              priority: 0,
            },
            {
              ministry_type_id: 0,
              priority: 0,
            },
            {
              ministry_type_id: 0,
              priority: 0,
            },
          ]
          this.ngOnInit()
          this.showForm = false
          this.createRegistryData[priority].ministry_type_id = 0
          this.createRegistryData[priority].priority = 0
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
        next: () => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true

          this.ministryTypeList = []
          this.createRegistryData = [
            {
              ministry_type_id: 0,
              priority: 0,
            },
            {
              ministry_type_id: 0,
              priority: 0,
            },
            {
              ministry_type_id: 0,
              priority: 0,
            },
          ]
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
