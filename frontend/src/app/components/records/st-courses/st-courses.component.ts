import { Component, Input, OnInit } from '@angular/core'
import { ICourse, ICreateCourse, IUpdateCourse } from './types'
import { StCoursesService } from './st-courses.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { IPermissions } from '../../shared/container/types'

@Component({
  selector: 'app-st-courses',
  templateUrl: './st-courses.component.html',
  styleUrls: ['./st-courses.component.css'],
})
export class StCoursesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: ICourse[] = []
  title = 'Cursos e Capacitações'
  createRegistryData: ICreateCourse = {
    begin_date: '',
    course_area: '',
    institution: '',
    conclusion_date: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: StCoursesService,
    private dataService: DataService,
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

    if (this.createRegistryData.course_area.length < 2) {
      this.showError('Insira a área do curso para prosseguir com o registro')
      return
    }

    if (this.createRegistryData.institution.length < 2) {
      this.showError('Insira a instituição para prosseguir com o registro')
      return
    }

    if (this.createRegistryData.begin_date.length < 2) {
      this.showError(
        'Informe a data de início do curso para prosseguir com o registro',
      )
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        begin_date: this.dataService.dateFormatter(
          this.createRegistryData.begin_date,
        ),
        conclusion_date: this.createRegistryData.conclusion_date
          ? this.dataService.dateFormatter(
              this.createRegistryData.conclusion_date,
            )
          : null,
      })
      .subscribe({
        next: () => {
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

  editRegistry(index: number) {
    this.isLoading = true

    if (this.allRegistries[index].course_area.length < 2) {
      this.showError('Insira a área do curso para prosseguir com o registro')
      return
    }

    if (this.allRegistries[index].institution.length < 2) {
      this.showError('Insira a instituição para prosseguir com o registro')
      return
    }

    if (this.allRegistries[index].begin_date.length < 2) {
      this.showError(
        'Informe a data de início do curso para prosseguir com o registro',
      )
      return
    }

    const newRegistry: Partial<ICourse> = {
      ...this.allRegistries[index],
      begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].begin_date,
      ),
      conclusion_date: this.allRegistries[index].conclusion_date
        ? this.dataService.dateFormatter(
            this.allRegistries[index].conclusion_date || '',
          )
        : null,
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.course_approved
    this.service.updateRegistry(newRegistry as IUpdateCourse).subscribe({
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
