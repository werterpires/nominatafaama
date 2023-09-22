import { Component, Input } from '@angular/core'
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
export class RelatedMinistriesComponent {
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

  ngOnInit() {
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
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
        next: (res) => {
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
          console.log(
            'Lista de Ministérios: ',
            this.ministryTypeList,
            'Registros: ',
            this.allRegistries,
          )
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
