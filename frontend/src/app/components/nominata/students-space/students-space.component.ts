import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { IBasicStudent } from '../types'
import { StudentsSpaceService } from './students-space.service'

@Component({
  selector: 'app-students-space',
  templateUrl: './students-space.component.html',
  styleUrls: ['./students-space.component.css', '../nominata.component.css'],
})
export class StudentsSpaceComponent implements OnInit {
  @Input() permissions: IPermissions = {
    estudante: false,
    secretaria: false,
    direcao: false,
    representacao: false,
    administrador: false,
    docente: false,
    ministerial: false,
    design: false,
    isApproved: false,
  }
  @Output() selectOne: EventEmitter<void> = new EventEmitter<void>()
  @Output() toStudent = new EventEmitter<{
    option: string
    studentId: string
  }>()

  @ViewChild('directorText') directorText!: ElementRef
  @ViewChild('readMore') readMore!: ElementRef

  nominataYear: string =
    new Date().getMonth() > 6
      ? new Date().getFullYear().toString()
      : (new Date().getFullYear() - 1).toString()
  title = 'Nominata'

  searchString = ''

  unions: string[] = []
  associations: string[] = []
  searchedUnion = ''
  searchedAssociation = ''
  searchedStudent = ''
  onlyfavs = false

  @Input() students: IBasicStudent[] | null | undefined = []

  studentsToList!: IBasicStudent[] | null

  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  urlBase = environment.API

  constructor(
    public datePipe: DatePipe,
    private router: Router,
    private studentsSpaceService: StudentsSpaceService,
  ) {}

  favorites: number[] = []

  ngOnInit() {
    if (this.students) {
      this.students.forEach((student) => {
        if (!this.unions.includes(student.union_acronym)) {
          this.unions.push(student.union_acronym)
        }
      })
      this.studentsToList = this.students
    }

    if (this.permissions.representacao || this.permissions.administrador) {
      this.getAllFavs()
    }
  }

  getAllFavs() {
    this.studentsSpaceService.findAllFavs().subscribe({
      next: (res) => {
        this.favorites = res
      },
      error: (error) => {
        this.favorites = []
      },
    })
  }

  favoriteStudent(event: { fav: boolean; studentId: number }) {
    if (event.fav) {
      this.setFav(event.studentId)
    } else {
      this.setNotFav(event.studentId)
    }
  }

  setFav(studentId: number) {
    this.isLoading = true
    this.studentsSpaceService.setFavs({ studentId }).subscribe({
      next: (res) => {
        this.favorites = res
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false
      },
    })
  }

  setNotFav(studentId: number) {
    this.isLoading = true
    this.studentsSpaceService.setNotFavs({ studentId }).subscribe({
      next: (res) => {
        this.favorites = res
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false
      },
    })
  }

  filterStudents(union?: boolean, fav?: boolean) {
    if (this.students) {
      this.studentsToList = this.students
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
  }

  filterStudentsByUnion() {
    if (this.studentsToList) {
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
  }

  filterStudentsByAssociation() {
    if (this.studentsToList) {
      this.studentsToList = this.studentsToList.filter((student) => {
        return student.association_acronym === this.searchedAssociation
      })
    }
  }

  filterStudentByname() {
    if (this.studentsToList) {
      this.studentsToList = this.studentsToList.filter((student) => {
        return student.name
          .toLowerCase()
          .includes(this.searchedStudent.toLocaleLowerCase())
      })
    }
  }

  filterStudentByFav() {
    if (this.studentsToList) {
      this.studentsToList = this.studentsToList.filter((student) => {
        return this.favorites.includes(student.student_id)
      })
    }
  }

  cleanFilters() {
    this.searchedAssociation = ''
    this.searchedUnion = ''
    this.searchedStudent = ''
    if (this.students) {
      this.studentsToList = this.students
    }
  }

  // getPhotoUrl(fileData: Uint8Array): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const blob = new Blob([fileData], { type: 'image/jpeg' })
  //     const reader = new FileReader()
  //     reader.onload = (event) => {
  //       const imageUrl = event.target?.result as string
  //       resolve(imageUrl)
  //     }
  //     reader.onerror = (event) => {
  //       reject(event.target?.error)
  //     }
  //     reader.readAsDataURL(blob)
  //   })
  // }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  selectStudent(studentId: string) {
    this.router.navigate(['student/' + studentId])
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
