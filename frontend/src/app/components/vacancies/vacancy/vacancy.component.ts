import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IVacancy } from './Types'
import { IMinistryType } from '../../parameterization/minstry-types/types'
import { IHiringStatus } from '../../parameterization/hiring-status/types'
import { VacancyService } from './vacancy.service'
import { UpdateVacancyDto } from '../types'
import { IBasicStudent } from '../../nominata/types'

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css'],
})
export class VacancyComponent implements OnInit {
  @Input() vacancy!: IVacancy
  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  allStudents: IBasicStudent[] = []

  @Input() allHiringStatus: IHiringStatus[] = []
  @Input() allMinistries: IMinistryType[] = []
  @Output() changeAlert = new EventEmitter<void>()

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.getAllStudents()
  }

  showAlert(func: string, message: string, idx?: number) {
    this.index = idx ?? this.index
    this.func = func
    this.alertMessage = message
    this.alert = true
  }
  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
  deleteRegistry() {
    this.isLoading = true
    this.vacancyService.deleteRegistry(this.vacancy.vacancyId).subscribe({
      next: () => {
        this.doneMessage = 'Vaga deletada com sucesso.'
        this.done = true
        this.changeAlert.emit()
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.error = true
        this.isLoading = false
      },
    })
  }

  editRegistry() {
    this.isLoading = true
    const updateVacancyData: UpdateVacancyDto = {
      description: this.vacancy.description,
      hiringStatusId: parseInt(this.vacancy.hiringStatusId.toString()),
      ministryId: parseInt(this.vacancy.ministryId.toString()),
      title: this.vacancy.title,
      vacancyId: this.vacancy.vacancyId,
    }
    this.vacancyService.updateRegistry(updateVacancyData).subscribe({
      next: () => {
        this.doneMessage = 'Vaga deletada com sucesso.'
        this.done = true
        this.changeAlert.emit()
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllStudents() {
    this.isLoading = true

    this.vacancyService
      .getStudentsWithNoAccepts(this.vacancy.nominataId)
      .subscribe({
        next: (res) => {
          this.allStudents = res
          console.log(this.allStudents)
          this.filterStudents()
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = error
          this.error = true
          this.isLoading = false
        },
      })
  }

  filterStudents() {
    const studentsIdInVacancy = this.vacancy.vacancyStudents.map(
      (student) => student.studentId,
    )
    console.log(studentsIdInVacancy)
    this.allStudents = this.allStudents.filter(
      (student) => !studentsIdInVacancy.includes(student.student_id),
    )
    console.log(this.allStudents)
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
      this.editRegistry()
      this.resetAlert()
    } else if (func == 'delete') {
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível deletar.'
        this.error = true
        this.resetAlert()
        return
      }
      this.deleteRegistry()
      this.resetAlert()
    }
  }
  resetAlert() {
    this.index = null
    this.func = ''
    this.alertMessage = ''
    this.alert = false
  }
}
