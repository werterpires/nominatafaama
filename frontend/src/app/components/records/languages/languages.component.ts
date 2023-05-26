import {Component, Input} from '@angular/core'
import {IPermissions} from '../../shared/container/types'
import {LanguageTypesService} from '../language-types/language-types.service'
import {ILanguageType} from '../language-types/types'
import {LanguageService} from './language.service'
import {ICreateLanguageDto, ILanguage, IUpdateLanguageDto} from './types'

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css'],
})
export class LanguagesComponent {
  @Input() permissions!: IPermissions

  allRegistries: ILanguage[] = []
  languageTypeList: Array<ILanguageType> = []
  title = 'Linguagens'
  createRegistryData: ICreateLanguageDto = {
    chosen_language: 0,
    read: true,
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
    this.languageTypeService.findAllLanguageTypes().subscribe({
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

  loga(texto: any) {
    console.log(texto)
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

  resetCreationRegistry() {
    Object.keys(this.createRegistryData).forEach((key) => {
      switch (typeof key) {
        case 'boolean':
          Object.defineProperty(this.createRegistryData, key, {value: false})
          break
        case 'number':
          Object.defineProperty(this.createRegistryData, key, {value: 0})
          break
        case 'string':
          Object.defineProperty(this.createRegistryData, key, {value: ''})
          break
      }
    })
  }

  editRegistry(i: number, buttonId: string) {
    this.isLoading = true
    const editFormationData: IUpdateLanguageDto = {
      chosen_language: this.allRegistries[i].chosen_language,
      fluent: this.allRegistries[i].fluent,
      language_id: this.allRegistries[i].language_id,
      person_id: this.allRegistries[i].person_id,
      read: this.allRegistries[i].read,
      speak: this.allRegistries[i].speak,
      understand: this.allRegistries[i].understand,
      unknown: this.allRegistries[i].unknown,
      write: this.allRegistries[i].write,
    }

    this.service.updateRegistry(editFormationData).subscribe({
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

  deleteRegistry(i: number) {
    this.isLoading = true
    this.service.deleteRegistry(i).subscribe({
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
