import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core'
import {
  CreateVacancyStudentDto,
  IVacancy,
  IVacancyStudent,
  UpdateVacancyStudentDto,
} from './Types'
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
  commentModal = false

  comment = ''
  readyToSave = false

  allStudents: IBasicStudent[] = []
  studentId = 0

  onlyfavs = false
  searchedUnion = ''
  unions: string[] = []
  associations: string[] = []

  searchedAssociation = ''
  searchedStudent = ''

  studentsToList!: IBasicStudent[] | null
  favorites: number[] = []

  @Input() allHiringStatus: IHiringStatus[] = []
  @Input() allMinistries: IMinistryType[] = []
  @Output() changeAlert = new EventEmitter<void>()

  constructor(
    private vacancyService: VacancyService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  onStudentDragStart(event: DragEvent, student: IBasicStudent) {
    if (!event.dataTransfer) {
      return
    }

    event.dataTransfer.setData('text/plain', JSON.stringify(student))
  }

  onVacancyDragStart(event: DragEvent, vacancyStudent: IVacancyStudent) {
    if (!event.dataTransfer) {
      return
    }

    event.dataTransfer.setData('text/plain', JSON.stringify(vacancyStudent))
  }

  onDragOver(event: DragEvent) {
    // Previne o comportamento padrão para permitir a queda
    event.preventDefault()
  }

  onDropInVacancy(event: DragEvent) {
    // Impede o comportamento padrão
    event.preventDefault()
    if (!event.dataTransfer) {
      return
    }
    // Obtém os dados transferidos durante o arrastar
    const studentData = event.dataTransfer.getData('text/plain')
    const student = JSON.parse(studentData)
    if (!student.student_id) {
      return
    }

    // Adiciona o estudante ao array vacancy.vacancyStudents
    // this.vacancy.vacancyStudents.push({ student: student });

    this.studentId = student.student_id
    this.showCommentModal()

    // this.addStudent(student.student_id)

    // // Remove o estudante do array allStudents
    // const index = this.allStudents.findIndex((s) => s === student)
    // if (index !== -1) {
    //   this.allStudents.splice(index, 1)
    // }
  }

  showCommentModal() {
    this.commentModal = true
  }

  onDropOutVacancy(event: DragEvent) {
    // Impede o comportamento padrão
    event.preventDefault()
    if (!event.dataTransfer) {
      return
    }
    // Obtém os dados transferidos durante o arrastar
    const vacancyStudentData = event.dataTransfer.getData('text/plain')
    const vacancyStudent = JSON.parse(vacancyStudentData)

    if (!vacancyStudent.vacancyStudentId) {
      return
    }

    // Adiciona o estudante ao array vacancy.vacancyStudents
    // this.vacancy.vacancyStudents.push({ student: student });

    this.removeStudent(vacancyStudent)
  }

  ngOnInit(): void {
    this.getAllStudents()
    console.log(this.vacancy)
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
        this.errorMessage = error.message
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
        this.errorMessage = error.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  editVacancyStudent(vacancyStudentId: number, comments: string) {
    this.isLoading = true
    const updateVacancyStudentData: UpdateVacancyStudentDto = {
      vacancyStudentId,
      comments,
    }
    this.vacancyService.updateComments(updateVacancyStudentData).subscribe({
      next: () => {
        this.doneMessage = 'Comentários atualizados.'
        this.done = true
        this.changeAlert.emit()
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  addStudent() {
    this.isLoading = true
    const addStudentToVacancyData: CreateVacancyStudentDto = {
      comments: this.comment,
      studentId: this.studentId,
      vacancyId: this.vacancy.vacancyId,
    }

    this.vacancyService.addStudentToVacancy(addStudentToVacancyData).subscribe({
      next: (res) => {
        this.vacancy.vacancyStudents.push(res)
        this.allStudents = this.allStudents.filter((student) => {
          return student.student_id !== res.studentId
        })

        this.studentsToList = this.allStudents
        this.cleanFilters()
        this.updateUnions()
        this.doneMessage = 'Estudante adicionado à vaga.'
        this.done = true
        this.studentId = 0
        this.commentModal = false
        this.comment = ''
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error.message
        this.error = true
        this.studentId = 0
        this.commentModal = false
        this.comment = ''
        this.isLoading = false
      },
    })
  }

  removeStudent(vacancyStudent: IVacancyStudent) {
    this.isLoading = true

    this.vacancyService
      .removeStudentFromVacancy(vacancyStudent.vacancyStudentId)
      .subscribe({
        next: (res) => {
          if (res) {
            this.allStudents.push(vacancyStudent.student)
            this.vacancy.vacancyStudents = this.vacancy.vacancyStudents.filter(
              (student) => {
                return (
                  student.vacancyStudentId !== vacancyStudent.vacancyStudentId
                )
              },
            )
            this.studentsToList = this.allStudents
            this.updateUnions()
            this.cleanFilters()
          }

          this.doneMessage = 'Estudante removido da vaga.'
          this.done = true

          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = error.message
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
          this.removeStudentsInVacancy()
          this.studentsToList = this.allStudents
          this.updateUnions()
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = error.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  updateUnions() {
    if (!this.studentsToList) {
      return
    }
    this.unions = []
    this.studentsToList.forEach((student) => {
      if (!this.unions.includes(student.union_acronym)) {
        this.unions.push(student.union_acronym)
      }
    })
  }

  filterStudents(union?: boolean, fav?: boolean) {
    if (!this.allStudents) {
      return
    }

    this.studentsToList = this.allStudents
    if (union) {
      this.searchedAssociation = ''
      this.associations = []
    }
    if (this.searchedUnion != '') {
      this.filterStudentsByUnion()
    }
    if (this.searchedAssociation != '') {
      this.filterStudentsByAssociation()
    }
    if (this.searchedStudent.length > 0) {
      this.filterStudentByname()
    }
    this.onlyfavs = fav ?? this.onlyfavs
    if (fav) {
      this.filterStudentByFav()
    }
  }

  cleanFilters() {
    this.searchedAssociation = ''
    this.searchedUnion = ''
    this.searchedStudent = ''
    if (this.allStudents) {
      this.studentsToList = this.allStudents
    }
  }

  filterStudentsByUnion() {
    if (!this.studentsToList) {
      return
    }
    this.studentsToList = this.studentsToList.filter((student) => {
      return student.union_acronym === this.searchedUnion
    })

    this.studentsToList.forEach((student) => {
      const association = student.association_acronym
      if (!this.associations.includes(association)) {
        this.associations.push(association)
      }
    })
  }

  filterStudentsByAssociation() {
    if (!this.studentsToList) {
      return
    }
    this.studentsToList = this.studentsToList.filter((student) => {
      return student.association_acronym === this.searchedAssociation
    })
  }

  filterStudentByname() {
    if (!this.studentsToList) {
      return
    }
    this.studentsToList = this.studentsToList.filter((student) => {
      return student.name
        .toLowerCase()
        .includes(this.searchedStudent.toLocaleLowerCase())
    })
  }

  filterStudentByFav() {
    if (!this.studentsToList) {
      return
    }
    this.studentsToList = this.studentsToList.filter((student) => {
      return this.favorites.includes(student.student_id)
    })
  }

  removeStudentsInVacancy() {
    const studentsIdInVacancy = this.vacancy.vacancyStudents.map(
      (student) => student.studentId,
    )

    this.allStudents = this.allStudents.filter(
      (student) => !studentsIdInVacancy.includes(student.student_id),
    )
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
