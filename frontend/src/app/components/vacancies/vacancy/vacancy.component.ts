import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core'
import { CreateVacancyStudentDto, IVacancy } from './Types'
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

  constructor(
    private vacancyService: VacancyService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  onDragStart(event: DragEvent, student: any) {
    if (!event.dataTransfer) {
      return
    }
    // Define os dados que serão transferidos durante o arrastar
    event.dataTransfer.setData('text/plain', JSON.stringify(student))
  }

  onDragOver(event: DragEvent) {
    // Previne o comportamento padrão para permitir a queda
    event.preventDefault()
  }

  onDrop(event: DragEvent) {
    // Impede o comportamento padrão
    event.preventDefault()
    if (!event.dataTransfer) {
      return
    }
    // Obtém os dados transferidos durante o arrastar
    const studentData = event.dataTransfer.getData('text/plain')
    const student = JSON.parse(studentData)

    // Adiciona o estudante ao array vacancy.vacancyStudents
    // this.vacancy.vacancyStudents.push({ student: student });
    console.log(student)
    this.addStudent(student.student_id)

    // Remove o estudante do array allStudents
    const index = this.allStudents.findIndex((s) => s === student)
    if (index !== -1) {
      this.allStudents.splice(index, 1)
    }
  }
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

  addStudent(studentId: number) {
    this.isLoading = true
    const addStudentToVacancyData: CreateVacancyStudentDto = {
      comments: '',
      studentId: studentId,
      vacancyId: this.vacancy.vacancyId,
    }
    console.log(addStudentToVacancyData)
    this.vacancyService.addStudentToVacancy(addStudentToVacancyData).subscribe({
      next: (res) => {
        this.vacancy.vacancyStudents.push(res)
        this.allStudents = this.allStudents.filter((student) => {
          return student.student_id !== res.studentId
        })

        this.doneMessage = 'Estudante adicionado à vaga.'
        this.done = true

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
