import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  CreatePublicationDto,
  IPublication,
  UpdatePublicationDto,
} from './types'
import { IPublicationType } from '../../parameterization/publication-types/types'
import { PublicationsService } from './publications.service'
import { PublicationTypeService } from '../../parameterization/publication-types/publication-types.service'
import { parse } from 'uuid'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
})
export class PublicationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IPublication[] = []
  publicationTypeList: Array<IPublicationType> = []
  title = 'Publicações'
  createRegistryData: CreatePublicationDto = {
    link: null,
    publication_type_id: 0,
    reference: '',
  }

  reference = ''

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: PublicationsService,
    private publicationTypeService: PublicationTypeService,
    private validateService: ValidateService,
  ) {}

  ngOnInit() {
    this.allRegistries = []
    this.publicationTypeList = []
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
        this.getAllTypes()
        this.isLoading = false
      },
    })
  }

  getAllTypes() {
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

    if (this.createRegistryData.publication_type_id < 1) {
      this.showError(
        'Escolha um tipo de publicação para prosseguir com o cadastro',
      )
      return
    }
    console.log('referencia:', this.createRegistryData.reference.length)

    if (this.createRegistryData.reference.length < 5) {
      this.showError('Siga o modelo e escreva a referência da obra.')
      return
    }

    if (
      this.createRegistryData.link &&
      this.createRegistryData.link.length > 0 &&
      !this.validateService.validateUrl(this.createRegistryData.link)
    ) {
      this.showError(
        'Se você possui um link para a sua obra, digite-o para prosseguir. Se não, apague todo o link no campo de cadastro.',
      )
      return
    }

    if (
      typeof this.createRegistryData.link == 'string' &&
      this.createRegistryData.link.length < 2
    ) {
      this.createRegistryData.link = null
    }
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
          this.ngOnInit()
          this.resetCreationRegistry()
          this.showForm = false
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

    if (this.allRegistries[index].publication_type_id < 1) {
      this.showError(
        'Escolha um tipo de publicação para prosseguir com o cadastro',
      )
      return
    }
    console.log('referencia:', this.allRegistries[index].reference.length)

    if (this.allRegistries[index].reference.length < 5) {
      this.showError('Siga o modelo e escreva a referência da obra.')
      return
    }

    const testLink = this.allRegistries[index].link

    if (
      testLink != null &&
      testLink.length &&
      !this.validateService.validateUrl(testLink)
    ) {
      this.showError(
        'Se você possui um link para a sua obra, digite-o para prosseguir. Se não, apague todo o link no campo de cadastro.',
      )
      return
    }

    if (this.allRegistries[index].link !== null) {
      const link = this.allRegistries[index].link
      if (link != null && link.length < 2) {
        this.allRegistries[index].link = null
      }
    }

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
  getSelectedPublicationTypeInstructions() {
    const selectedPublicationType = this.publicationTypeList.find(
      (publicationType) =>
        publicationType.publication_type_id ==
        this.createRegistryData.publication_type_id,
    )
    if (selectedPublicationType?.instructions) {
      this.reference = selectedPublicationType?.instructions
    }
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
