import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { DataService } from '../shared/shared.service.ts/data.service'
import { DomSanitizer } from '@angular/platform-browser'
import { NominataService } from './nominata.service'
import { IBasicProfessor, IBasicStudent, ICompleteNominata } from './types'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { LoginService } from '../shared/shared.service.ts/login.service'

@Component({
  selector: 'app-nominata',
  templateUrl: './nominata.component.html',
  styleUrls: ['./nominata.component.css'],
})
export class NominataComponent implements OnInit {
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

  Registry: ICompleteNominata | null = null
  nominataYear: string =
    new Date().getMonth() > 6
      ? new Date().getFullYear().toString()
      : (new Date().getFullYear() - 1).toString()
  title = 'Nominata'

  words: string[] = []

  searchString = ''

  director!: IBasicProfessor | undefined

  unions: string[] = []
  associations: string[] = []
  searchedUnion = ''
  searchedAssociation = ''
  searchedStudent = ''

  studentsToList!: IBasicStudent[] | null

  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  urlBase = environment.API

  constructor(
    private service: NominataService,
    private loginService: LoginService,
    public datePipe: DatePipe,
    private router: Router,
  ) {}

  user: IUserApproved | null = null

  ngOnInit() {
    this.loginService.user$.subscribe((user) => {
      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []

      if (typeof user !== 'string' && user) {
        this.user = user

        roles = this.user.roles.map((role) => role.role_name.toLowerCase())

        this.permissions.isApproved = this.user.user_approved
      } else {
        this.user = null
        this.router.navigate(['nominata'])
        this.permissions.isApproved = false
      }
      this.permissions.estudante = roles.includes('estudante')
      this.permissions.secretaria = roles.includes('secretaria')
      this.permissions.direcao = roles.includes('direção')
      this.permissions.representacao = roles.includes('representante de campo')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
    })
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries(this.nominataYear).subscribe({
      next: async (res) => {
        this.Registry = res

        this.Registry.director_words = this.Registry.director_words
          .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
          .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')

        this.words = this.Registry.director_words.split('\n')

        const blob = new Blob(
          [new Uint8Array(this.Registry.photo?.file.data)],
          {
            type: 'image/jpeg',
          },
        )
        if (blob instanceof Blob) {
          const reader = new FileReader()
          reader.onload = (e: any) => {
            if (this.Registry?.photo) {
              this.Registry.imgUrl = e.target.result
            }
          }
          reader.readAsDataURL(blob)
        } else {
          this.showForm = true
          this.isLoading = false
        }

        if (this.Registry.students) {
          this.Registry.students = this.Registry.students.sort((a, b) => {
            const nameA = a.name.trim().toLowerCase()
            const nameB = b.name.trim().toLowerCase()

            if (nameA < nameB) {
              return -1
            } else if (nameA > nameB) {
              return 1
            } else {
              return 0
            }
          })

          if (this.Registry.professors) {
            this.findDirector(this.Registry.professors, this.Registry.director)
          }
        }

        this.Registry.students?.forEach((student) => {
          // const blob = new Blob([new Uint8Array(student.photo?.file.data)], {
          //   type: 'image/jpeg',
          // })
          // if (blob instanceof Blob) {
          //   const reader = new FileReader()
          //   reader.onload = (e: any) => {
          //     student.imgUrl = e.target.result
          //   }
          //   reader.readAsDataURL(blob)
          // } else {
          //   this.showForm = true
          // }

          // Separação das uniões e associações
          const union = student.union_acronym
          if (!this.unions.includes(union)) {
            this.unions.push(union)
          }
        })

        if (this.Registry.professors) {
          this.Registry.professors = this.Registry.professors.sort((a, b) => {
            const nameA = a.name.trim().toLowerCase()
            const nameB = b.name.trim().toLowerCase()

            if (nameA < nameB) {
              return -1
            } else if (nameA > nameB) {
              return 1
            } else {
              return 0
            }
          })
        }

        this.Registry.professors?.forEach(() => {
          // const blob = new Blob([new Uint8Array(professor.photo?.file.data)], {
          //   type: 'image/jpeg',
          // })
          // if (blob instanceof Blob) {
          //   const reader = new FileReader()
          //   reader.onload = (e: any) => {
          //     professor.imgUrl = e.target.result
          //   }
          //   reader.readAsDataURL(blob)
          // } else {
          //   this.showForm = true
          // }
        })

        if (this.Registry.events) {
          this.Registry.events = this.Registry.events.sort((a, b) => {
            const dataA = new Date(a.event_date)
            const dataB = new Date(b.event_date)

            if (dataA < dataB) {
              return -1
            } else if (dataA > dataB) {
              return 1
            } else {
              // Se as datas forem iguais, ordene pelos valores de horário
              const horaA = parseInt(a.event_time)
              const horaB = parseInt(b.event_time)

              return horaA - horaB
            }
          })
        }

        this.studentsToList = this.Registry.students

        this.isLoading = false
      },
      error: (err) => {
        this.nominataYear = (parseInt(this.nominataYear) - 1).toString()
        this.getAllRegistries()
        this.errorMessage = err.message
        this.error = true
      },
    })
  }

  findDirector(professors: IBasicProfessor[], directorId: number) {
    this.director = professors.find(
      (professor) => professor.professor_id === directorId,
    )
  }

  filterStudents(union?: boolean) {
    if (this.Registry?.students) {
      this.studentsToList = this.Registry?.students
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
      console.log('estou chegando aqui')
      this.studentsToList = this.studentsToList.filter((student) => {
        return student.name
          .toLowerCase()
          .includes(this.searchedStudent.toLocaleLowerCase())
      })
    }
  }

  cleanFilters() {
    this.searchedAssociation = ''
    this.searchedUnion = ''
    this.searchedStudent = ''
    if (this.Registry?.students) {
      this.studentsToList = this.Registry?.students
    }
  }

  getPhotoUrl(fileData: Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([fileData], { type: 'image/jpeg' })
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        resolve(imageUrl)
      }
      reader.onerror = (event) => {
        reject(event.target?.error)
      }
      reader.readAsDataURL(blob)
    })
  }

  small = true

  growText() {
    const divElement = this.directorText.nativeElement
    const buttonElement = this.readMore.nativeElement
    divElement.style.transition = 'max-height 5s ease-in-out'
    if (this.small == true) {
      divElement.style.maxHeight = 'fit-content'
      buttonElement.innerText = 'Mostrar menos'
      this.small = !this.small
    } else {
      divElement.style.maxHeight = '337.516px'
      buttonElement.innerText = 'Continue lendo'

      this.small = !this.small
    }
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  setFavorite(studentId: number, fav: boolean) {
    console.log(fav)
  }

  selectStudent(studentId: string) {
    this.router.navigate(['student/' + studentId])
    // this.toStudent.emit({ option: 'student', studentId: studentId })
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
