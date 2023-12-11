import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { AcademicDegreeService } from '../../parameterization/academic-degrees/academic-degrees.service'
import { IAcademicDegree } from '../../parameterization/academic-degrees/types'
import { StudentAcademicFormationsService } from './student-academic-formations.service'
import {
  IStAcademicFormation,
  IStCreateAcademicFormation,
  IStUpdateAcademicFormation,
} from './types'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'

@Component({
  selector: 'app-student-academic-formations',
  templateUrl: './student-academic-formations.component.html',
  styleUrls: ['./student-academic-formations.component.css'],
})
export class StudentAcademicFormationsComponent implements OnInit {
  @Input() permissions!: IPermissions

  @Input() del = true
  @Input() new = true
  @Input() approve = false
  @Input() userId: number | null = null

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
    this.createRegistryData = {
      begin_date: '',
      conclusion_date: '',
      course_area: '',
      degree_id: 0,
      institution: '',
    }
    this.allRegistries = []
    this.allDegrees = []
    this.resetCreationRegistry()
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
    this.service.findAllRegistries(this.userId).subscribe({
      next: (res) => {
        this.allRegistries = res
        this.allDegrees = []
        this.getAlltypes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.getAlltypes()
        this.isLoading = false
      },
    })
  }

  getAlltypes() {
    this.academicDegreeService.findAllRegistries().subscribe({
      next: (res) => {
        this.allDegrees = res
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

    if (this.createRegistryData.degree_id < 1) {
      this.showError('Insira um grau acadêmico para prosseguir com o registro.')
      return
    }

    if (this.createRegistryData.course_area.length < 2) {
      this.showError(
        'Insira uma área de formação para prosseguir com o registro.',
      )
      return
    }

    if (this.createRegistryData.institution.length < 2) {
      this.showError('Insira uma instituição para prosseguir com o registro.')
      return
    }

    if (this.createRegistryData.begin_date.length != 10) {
      this.showError(
        'Insira uma data de início para prosseguir com o registro.',
      )
      return
    }

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
        next: () => {
          this.ngOnInit()
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
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

    if (this.allRegistries[index].degree_id < 1) {
      this.showError('Insira um grau acadêmico para prosseguir com o registro.')
      return
    }

    if (this.allRegistries[index].course_area.length < 2) {
      this.showError(
        'Insira uma área de formação para prosseguir com o registro.',
      )
      return
    }

    if (this.allRegistries[index].institution.length < 2) {
      this.showError('Insira uma instituição para prosseguir com o registro.')
      return
    }

    if (this.allRegistries[index].begin_date.length != 10) {
      this.showError(
        'Insira uma data de início para prosseguir com o registro.',
      )
      return
    }

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
      next: () => {
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true

        this.isLoading = false
        this.ngOnInit()
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
