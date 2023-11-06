import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { LanguageTypesService } from '../../parameterization/language-types/language-types.service'
import { ILanguageType } from '../../parameterization/language-types/types'
import {
  ILanguage,
  ICreateLanguageDto,
  IUpdateLanguageDto,
} from '../languages/types'
import { SpLanguageService } from './sp-language.service'

@Component({
  selector: 'app-sp-languages',
  templateUrl: './sp-languages.component.html',
  styleUrls: ['./sp-languages.component.css'],
})
export class SpLanguagesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: ILanguage[] = []
  languageTypeList: Array<ILanguageType> = []
  title = 'Idiomas do cônjuge'
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
    private service: SpLanguageService,
    private languageTypeService: LanguageTypesService,
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
    this.languageTypeList = []
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
        this.languageTypeList = []
        this.getAllLanguageTypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.getAllLanguageTypes()
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
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true

          this.resetCreationRegistry()
          this.ngOnInit()
          this.showForm = false
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
