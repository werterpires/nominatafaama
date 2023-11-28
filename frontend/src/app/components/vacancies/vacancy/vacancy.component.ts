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
  CreateInviteDto,
  CreateVacancyStudentDto,
  IInvite,
  IVacancy,
  IVacancyStudent,
  UpdateVacancyStudentDto,
} from './Types'
import { IMinistryType } from '../../parameterization/minstry-types/types'
import { IHiringStatus } from '../../parameterization/hiring-status/types'
import { VacancyService } from './vacancy.service'
import { UpdateVacancyDto } from '../types'
import { IBasicStudent } from '../../nominata/types'
import { IBasicInviteData } from '../invites/types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'
import { InvitesService } from './invites.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

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
  error = false
  doneMessage = ''
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

  vacancyStudentId: number | null = null

  @Input() allHiringStatus: IHiringStatus[] = []
  @Input() allMinistries: IMinistryType[] = []
  @Output() changeAlert = new EventEmitter<void>()

  constructor(
    private vacancyService: VacancyService,
    private renderer: Renderer2,
    private el: ElementRef,
    private errorService: ErrorServices,
    private inviteService: InvitesService,
    private dataService: DataService,
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

  sortStudents() {
    this.vacancy.vacancyStudents = this.vacancy.vacancyStudents.sort((a, b) => {
      // Caso: algum invite.accept == true
      if (a.invites.some((i) => i.accept) && !b.invites.some((i) => i.accept)) {
        return -1
      } else if (
        b.invites.some((i) => i.accept) &&
        !a.invites.some((i) => i.accept)
      ) {
        return 1
      }

      // Caso: algum invite.accept == null
      if (
        a.invites.some((i) => i.accept === null) &&
        !b.invites.some((i) => i.accept === null)
      ) {
        return -1
      } else if (
        b.invites.some((i) => i.accept === null) &&
        !a.invites.some((i) => i.accept === null)
      ) {
        return 1
      }

      // Caso: invites.length == 0
      if (a.invites.length === 0 && b.invites.length > 0) {
        return -1
      } else if (b.invites.length === 0 && a.invites.length > 0) {
        return 1
      }

      // Caso: algum invite.accept == false
      if (
        a.invites.some((i) => i.accept === false) &&
        !b.invites.some((i) => i.accept === false)
      ) {
        return -1
      } else if (
        b.invites.some((i) => i.accept === false) &&
        !a.invites.some((i) => i.accept === false)
      ) {
        return 1
      }

      return 0 // Se todas as condições anteriores não foram atendidas
    })
  }

  ngOnInit(): void {
    this.errorService.error$.subscribe((error) => (this.error = error))
    this.getAllStudents()
    this.sortStudents()
  }

  insertInvite(
    vacancyStudentId: number,
    inviteBasicData: IBasicInviteData,
    inviteId: number,
  ) {
    const vacStuIdx = this.vacancy.vacancyStudents.findIndex(
      (vacStu) => vacStu.vacancyStudentId === vacancyStudentId,
    )
    const invite: IInvite = {
      inviteId: inviteId,
      vacancyStudentId: vacancyStudentId,
      accept: null,
      deadline: inviteBasicData.deadline,
      approved: null,
      voteDate: inviteBasicData.voteDate,
      voteNumber: inviteBasicData.voteNumber,
    }
    this.vacancy.vacancyStudents[vacStuIdx].invites.push(invite)
    this.sortStudents()
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
        this.errorService.showError(error.message)
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
        this.errorService.showError(error.message)
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
        this.errorService.showError(error.message)
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
        this.errorService.showError(error.message)
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
          this.errorService.showError(error.message)
          this.isLoading = false
        },
      })
  }

  createInvite(createInviteBasicData: IBasicInviteData) {
    this.isLoading = true
    const vacancyStudent = this.vacancy.vacancyStudents.find(
      (vacancyStudent) => {
        return vacancyStudent.vacancyStudentId === this.vacancyStudentId
      },
    )

    if (!vacancyStudent) {
      this.errorService.showError('Vaga ou estudantes não encontrados')
      return
    }
    const createInviteData: CreateInviteDto = {
      deadline: this.dataService.dateFormatter(createInviteBasicData.deadline),
      voteDate: this.dataService.dateFormatter(createInviteBasicData.voteDate),
      voteNumber: createInviteBasicData.voteNumber,
      vacancyId: this.vacancy.vacancyId,
      studentId: vacancyStudent.studentId,
      vacancyStudentId: vacancyStudent.vacancyStudentId,
    }

    this.inviteService.createInvite(createInviteData).subscribe({
      next: (res) => {
        this.insertInvite(
          vacancyStudent.vacancyStudentId,
          createInviteBasicData,
          res.inviteId,
        )
        this.doneMessage = 'Convite criado com sucesso.'
        this.done = true
        this.changeAlert.emit()
        this.isLoading = false
      },
      error: (error) => {
        this.errorService.showError(error.message)
        this.isLoading = false
      },
    })

    console.log(createInviteData)

    this.vacancyStudentId = null
    this.inviteModal = false
    this.isLoading = false
  }

  inviteModal = false

  showInviteModal(vacancyStudentId: number) {
    this.inviteModal = true
    this.vacancyStudentId = vacancyStudentId
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
          this.errorService.showError(error.message)
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
        this.errorService.showError('Index não localizado. Impossível editar.')
        this.resetAlert()
        return
      }
      this.editRegistry()
      this.resetAlert()
    } else if (func == 'delete') {
      if (this.index == null) {
        this.errorService.showError('Index não localizado. Impossível deletar.')
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
