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
import { RelatedMinistriesService } from '../related-ministries/related-ministries.service'

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
    private service: SpRelatedMinistriesService,
    private ministryTypesService: MinistryTypesService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.getAllTypes()
    this.ministryTypeList = this.filterMinistriesByType(
      this.ministryTypeList,
      this.allRegistries,
    )
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

  getAllTypes() {
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

  filterMinistriesByType(
    firstArray: IMinistryType[],
    secondArray: IRelatedMinistry[],
  ): IMinistryType[] {
    const ministryTypeIds = secondArray.map((item) => item.ministry_type_id)
    const filtered = firstArray.filter((item) => {
      if (!ministryTypeIds.includes(item.ministry_type_id)) {
        return true
      }
      return false
    })
    return filtered
  }

  createRegistry(priority: number) {
    this.isLoading = true
    const idx = priority + 1
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
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  // deleteRegistry(id: number) {
  //   this.isLoading = true
  //   this.service.deleteRegistry(id).subscribe({
  //     next: (res) => {
  //       this.doneMessage = 'Registro removido com sucesso.'
  //       this.done = true
  //       this.isLoading = false
  //       this.ngOnInit()
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Não foi possível remover o registro.'
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
