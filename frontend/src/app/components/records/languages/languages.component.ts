import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { LanguageTypesService } from '../language-types/language-types.service'
import { ILanguageType } from '../language-types/types'
import { LanguageService } from './language.service'
import { ICreateLanguageDto, ILanguage, IUpdateLanguageDto } from './types'

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css'],
})
export class LanguagesComponent {
  @Input() permissions!: IPermissions

  allRegistries: ILanguage[] = []
  languageTypeList: Array<ILanguageType> = []
  title = 'Idiomas'
  createRegistryData: ICreateLanguageDto = {
    chosen_language: 0,
    read: false,
    understand: false,
    speak: false,
    write: false,
    fluent: false,
    unknown: false,
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: LanguageService,
    private languageTypeService: LanguageTypesService,
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
    this.languageTypeService.findAllRegistries().subscribe({
      next: (res) => {
        this.languageTypeList = res
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
      switch (typeof this.createRegistryData[key as keyof ICreateLanguageDto]) {
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
    console.log(this.createRegistryData.chosen_language)
    if (this.createRegistryData.chosen_language < 1) {
      this.showError('Escolha um idioma antes de prosseguir.')
      return
    }

    if (
      !this.createRegistryData.fluent &&
      !this.createRegistryData.read &&
      !this.createRegistryData.speak &&
      !this.createRegistryData.understand &&
      !this.createRegistryData.write
    ) {
      this.showError(
        'Informe uma ou mais opções para evidenciar sua relação com o idioma escolhido.',
      )
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        chosen_language: parseInt(
          this.createRegistryData.chosen_language.toString(),
        ),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.resetCreationRegistry()
          this.ngOnInit()
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

    if (this.allRegistries[index].chosen_language < 1) {
      this.showError('Escolha um idioma antes de prosseguir.')
      return
    }

    if (
      !this.allRegistries[index].fluent &&
      !this.allRegistries[index].read &&
      !this.allRegistries[index].speak &&
      !this.allRegistries[index].understand &&
      !this.allRegistries[index].write
    ) {
      this.showError(
        'Informe uma ou mais opções para evidenciar sua relação com o idioma escolhido.',
      )
      return
    }
    console.log(this.allRegistries[index].chosen_language)
    console.log(this.allRegistries[index].chosen_language)
    const newRegistry: Partial<ILanguage> = {
      ...this.allRegistries[index],
      chosen_language: parseInt(
        this.allRegistries[index].chosen_language.toString(),
      ),
    }

    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.language_approved
    delete newRegistry.language

    this.service.updateRegistry(newRegistry as IUpdateLanguageDto).subscribe({
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
