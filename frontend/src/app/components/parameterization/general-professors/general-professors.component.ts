import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  ICreateProfessorAssignment,
  IProfessor,
  IUpdateProfessorAssignment,
} from '../../records/professors/types'
import { GeneralProfessorsService } from './general-professors.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ISinteticProfessor } from '../nominatas-professors/types'

@Component({
  selector: 'app-general-professors',
  templateUrl: './general-professors.component.html',
  styleUrls: ['./general-professors.component.css'],
})
export class GeneralProfessorsComponent {
  @Input() permissions!: IPermissions

  allRegistries: ISinteticProfessor[] = []
  title = 'Professores'
  createRegistryData: ICreateProfessorAssignment = {
    assignments: '',
    cpf: '',
    name: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: GeneralProfessorsService,
    public dataService: DataService,
  ) {}

  ngOnInit() {
    this.createRegistryData = {
      assignments: '',
      cpf: '',
      name: '',
    }
    this.getAllRegistries()
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

  formatarCPF() {
    if (this.createRegistryData.cpf)
      this.createRegistryData.cpf = this.createRegistryData.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      )
    console.log('estou funcionando')
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
        cpf: this.createRegistryData.cpf?.replace(/[^\d]/g, ''),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
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

    const updateProfessorData: IUpdateProfessorAssignment = {
      professor_id: this.allRegistries[index].professor_id,
      assignments: this.allRegistries[index].assignments,
      cpf: this.allRegistries[index].cpf,
      name: this.allRegistries[index].name,
    }

    this.service.updateRegistry(updateProfessorData).subscribe({
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
