import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { AcademicDegreeService } from '../academic-degrees/academic-degrees.service'
import { IAcademicDegree } from '../academic-degrees/types'
import { StudentAcademicFormationsService } from './student-academic-formations.service'
import {
  IStAcademicFormation,
  IStCreateAcademicFormation,
  IStUpdateAcademicFormation,
} from './types'

@Component({
  selector: 'app-student-academic-formations',
  templateUrl: './student-academic-formations.component.html',
  styleUrls: ['./student-academic-formations.component.css'],
})
export class StudentAcademicFormationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IStAcademicFormation[] = []
  allDegrees: IAcademicDegree[] = []

  title = 'Formações Acadêmicas'
  createRegistryData: IStCreateAcademicFormation = {
    begin_date: '',
    conclusion_date: '',
    course_area: '',
    degree_id: 0,
    institution: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: StudentAcademicFormationsService,
    private academicDegreeService: AcademicDegreeService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
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

    this.academicDegreeService.findAllRegistries().subscribe({
      next: (res) => {
        this.allDegrees = res
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
        degree_id: parseInt(this.createRegistryData.degree_id.toString()),
        begin_date: this.dataService.dateFormatter(
          this.createRegistryData.begin_date,
        ),
        conclusion_date: this.dataService.dateFormatter(
          this.createRegistryData.conclusion_date || '',
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

    const newRegistry: IStUpdateAcademicFormation = {
      begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].begin_date,
      ),
      conclusion_date: this.dataService.dateFormatter(
        this.allRegistries[index].conclusion_date || '',
      ),
      course_area: this.allRegistries[index].course_area,
      degree_id: parseInt(this.allRegistries[index].degree_id.toString()),
      formation_id: parseInt(this.allRegistries[index].formation_id.toString()),
      institution: this.allRegistries[index].institution,
    }

    this.service.updateRegistry(newRegistry).subscribe({
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
