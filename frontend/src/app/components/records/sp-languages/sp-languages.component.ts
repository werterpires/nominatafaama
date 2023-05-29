import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { LanguageTypesService } from '../language-types/language-types.service'
import { ILanguageType } from '../language-types/types'
import { LanguageService } from '../languages/language.service'
import {
  ILanguage,
  ICreateLanguageDto,
  IUpdateLanguageDto,
} from '../languages/types'

@Component({
  selector: 'app-sp-languages',
  templateUrl: './sp-languages.component.html',
  styleUrls: ['./sp-languages.component.css'],
})
export class SpLanguagesComponent {
  @Input() permissions!: IPermissions

  allRegistries: ILanguage[] = []
  languageTypeList: Array<ILanguageType> = []
  title = 'Linguagens'
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
        chosen_language: parseInt(
          this.createRegistryData.chosen_language.toString(),
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

    const newRegistry: Partial<ILanguage> = {
      ...this.allRegistries[index],
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

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
