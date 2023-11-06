import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  CreatePublicationDto,
  IPublication,
  UpdatePublicationDto,
} from './types'
import { IPublicationType } from '../../parameterization/publication-types/types'
import { PublicationsService } from './publications.service'
import { PublicationTypeService } from '../../parameterization/publication-types/publication-types.service'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
})
export class PublicationsComponent implements OnInit {
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
    this.publicationTypeList = []
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
        this.publicationTypeList = []
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
        next: () => {
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

  editRegistry(index: number) {
    this.isLoading = true

    if (this.allRegistries[index].publication_type_id < 1) {
      this.showError(
        'Escolha um tipo de publicação para prosseguir com o cadastro',
      )
      return
    }

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
      next: () => {
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
      next: () => {
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
