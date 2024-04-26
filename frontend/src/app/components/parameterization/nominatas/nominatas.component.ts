import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { ICreateNominataDto, INominata, IUpdateNominata } from './types'
import { NominatasService } from './nominatas.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ProfessorsService } from '../../records/professors/professors.service'
import { GeneralProfessorsService } from '../general-professors/general-professors.service'
import { IProfessor } from '../../records/professors/types'
import { ISinteticProfessor } from '../nominatas-professors/types'

@Component({
  selector: 'app-nominatas',
  templateUrl: './nominatas.component.html',
  styleUrls: ['./nominatas.component.css'],
})
export class NominatasComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: INominata[] = []
  title = 'Nominatas'
  createRegistryData: ICreateNominataDto = {
    orig_field_invites_begin: '',
    other_fields_invites_begin: '',
    year: '',
    director_words: '',
    director: 0,
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  allProfessors: ISinteticProfessor[] = []

  constructor(
    private service: NominatasService,
    public dataService: DataService,
    private generalProfessorsService: GeneralProfessorsService,
  ) {}

  ngOnInit() {
    this.createRegistryData = {
      orig_field_invites_begin: '',
      other_fields_invites_begin: '',
      year: '',
      director_words: '',
      director: 0,
    }
    this.allProfessors = []
    this.getAllRegistries()
    this.getProfessors()
  }

  getProfessors() {
    this.isLoading = true
    this.generalProfessorsService.findAllRegistries().subscribe({
      next: (res) => {
        this.allProfessors = res
        this.dataService.nominatas = this.allRegistries
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
        this.dataService.nominatas = this.allRegistries
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
        orig_field_invites_begin: this.dataService.dateFormatter(
          this.createRegistryData.orig_field_invites_begin,
        ),
        other_fields_invites_begin: this.dataService.dateFormatter(this.createRegistryData.other_fields_invites_begin??''),
        director: parseInt(this.createRegistryData.director.toString()),
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.allProfessors = []
          this.getAllRegistries()
          this.getProfessors()
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

    const otherFildsDate: string = this.allRegistries[index].other_fields_invites_begin ?? '';



    const updateNominataData: IUpdateNominata = {
      nominata_id: this.allRegistries[index].nominata_id,
      orig_field_invites_begin: this.dataService.dateFormatter(
        this.allRegistries[index].orig_field_invites_begin,
      ),
      other_fields_invites_begin: otherFildsDate.length > 0 ? this.dataService.dateFormatter(otherFildsDate):'',
      year: this.allRegistries[index].year,
      director_words: this.allRegistries[index].director_words,
      director: parseInt(this.allRegistries[index].director.toString()),
    }

    this.service.updateRegistry(updateNominataData).subscribe({
      next: () => {
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
      next: () => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
      },
      error: () => {
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
