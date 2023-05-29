import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { PublicationTypeService } from '../publication-types/publication-types.service'
import { IPublicationType } from '../publication-types/types'
import {
  CreatePublicationDto,
  IPublication,
  UpdatePublicationDto,
} from '../publications/types'
import { SpPublicationsService } from './sp-publications.service'

@Component({
  selector: 'app-sp-publications',
  templateUrl: './sp-publications.component.html',
  styleUrls: ['./sp-publications.component.css'],
})
export class SpPublicationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IPublication[] = []
  publicationTypeList: Array<IPublicationType> = []
  title = 'Publicações'
  createRegistryData: CreatePublicationDto = {
    link: '',
    publication_type_id: 0,
    reference: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: SpPublicationsService,
    private publicationTypeService: PublicationTypeService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.getAllLanguageTypes()
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

  getAllLanguageTypes() {
    this.isLoading = true
    this.publicationTypeService.findAllRegistries().subscribe({
      next: (res) => {
        this.publicationTypeList = res
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
        publication_type_id: parseInt(
          this.createRegistryData.publication_type_id.toString(),
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
    const newRegistry: Partial<IPublication> = {
      ...this.allRegistries[index],
      publication_type_id: parseInt(
        this.allRegistries[index].publication_type_id.toString(),
      ),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.instructions
    delete newRegistry.publication_approved
    delete newRegistry.publication_type

    this.service.updateRegistry(newRegistry as UpdatePublicationDto).subscribe({
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
