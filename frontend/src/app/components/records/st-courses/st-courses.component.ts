import { Component, Input } from '@angular/core'
import { ICourse, ICreateCourse, IUpdateCourse } from './types'
import { StCoursesService } from './st-courses.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { IPermissions } from '../../shared/container/types'

@Component({
  selector: 'app-st-courses',
  templateUrl: './st-courses.component.html',
  styleUrls: ['./st-courses.component.css'],
})
export class StCoursesComponent {
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
