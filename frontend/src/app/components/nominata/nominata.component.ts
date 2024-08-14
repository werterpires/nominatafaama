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
import { NominatasService } from '../parameterization/nominatas/nominatas.service'

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

  invite = false

  Registry: ICompleteNominata | null = null
  nominataYear = ''

  title = 'Nominata'

  shortNominatas: { nominataId: number; year: string }[] = []

  getShortNominatas() {
    this.isLoading = true
    this.nominatasService.findAllNominataYearsRegistries().subscribe({
      next: (res) => {
        this.shortNominatas = res

        let isValidYear = false

        let actualYear: number =
          new Date().getMonth() > 6
            ? new Date().getFullYear()
            : new Date().getFullYear() - 1

        while (!isValidYear) {
          if (
            this.shortNominatas.find(
              (nominata) =>
                nominata.year === actualYear.toString() || actualYear < 1980,
            )
          ) {
            isValidYear = true
            this.nominataYear = actualYear.toString()
          } else {
            actualYear -= 1
          }

          this.getAllRegistries()
        }

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

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
    private nominatasService: NominatasService,
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

    this.getShortNominatas()
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
        this.rollCarrossel()
      },
      error: (err) => {
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

  selectStudent(studentId: string) {
    this.router.navigate(['student/' + studentId])
    // this.toStudent.emit({ option: 'student', studentId: studentId })
  }

  // rollCarrossel(index? = 0) {
  //   const attemptInterval = 62.5 // Intervalo entre as tentativas (5 segundos)
  //   const maxAttempts = 800 // Número máximo de tentativas

  //   const tryInitializeCarrossel = (attempts: number) => {
  //     const photoNumber = this.Registry?.class_photo.length
  //     if (photoNumber) {
  //       // Capturar todos os elementos com a classe "classPhotoContainer"
  //       const allPhotos = document.querySelectorAll(
  //         '.classPhotoContainer',
  //       ) as NodeListOf<HTMLElement>

  //       const photoControllers = document.querySelectorAll(
  //         '.sliderController',
  //       ) as NodeListOf<HTMLElement>

  //       // Verifica se os elementos foram encontrados
  //       if (allPhotos.length === 0 && attempts < maxAttempts) {
  //         // Tenta novamente após o intervalo
  //         setTimeout(
  //           () => tryInitializeCarrossel(attempts + 1),
  //           attemptInterval,
  //         )
  //         return
  //       }

  //       if (allPhotos.length === 0) {
  //         console.error(
  //           'Não foram encontrados elementos com a classe "classPhotoContainer".',
  //         )
  //         return
  //       }

  //       let currentIndex = index

  //       // Função para mover as fotos
  //       const movePhotos = () => {
  //         // Calcula o quanto cada foto deve se mover com base no índice
  //         allPhotos.forEach((photo) => {
  //           const offset = -100 * currentIndex // Multiplicado pelo índice atual
  //           photo.style.transform = `translateX(${offset}%)`
  //         })

  //         if (currentIndex !== 0) {
  //           photoControllers[currentIndex - 1].classList.remove(
  //             'controllerSelected',
  //           )
  //         } else {
  //           photoControllers[photoControllers.length - 1].classList.remove(
  //             'controllerSelected',
  //           )
  //         }

  //         photoControllers[currentIndex].classList.add('controllerSelected')

  //         // Incrementa o índice atual
  //         currentIndex++

  //         // Se todas as fotos foram exibidas, reinicia o índice para começar do início
  //         if (currentIndex === photoNumber) {
  //           currentIndex = 0
  //         }
  //       }

  //       // Inicia a rolagem do carrossel a cada 8 segundos
  //       movePhotos() // Chamada inicial para começar imediatamente
  //       setInterval(movePhotos, 6000) // Repetir a cada 8 segundos
  //     } else {
  //       console.error(
  //         'Não foi possível encontrar o número de fotos no Registry.',
  //       )
  //     }
  //   }

  //   // Inicializa a função de tentativa
  //   tryInitializeCarrossel(0)
  // }

  carrosselIntervalId: ReturnType<typeof setInterval> | null = null // Variável global para armazenar o ID do intervalo

  // Função separada para mover as fotos
  movePhotos(
    allPhotos: NodeListOf<HTMLElement>,
    photoControllers: NodeListOf<HTMLElement>,
    currentIndex: number,
    photoNumber: number,
  ): number {
    // Calcula o quanto cada foto deve se mover com base no índice
    allPhotos.forEach((photo) => {
      const offset = -100 * currentIndex // Multiplicado pelo índice atual
      photo.style.transform = `translateX(${offset}%)`
    })

    photoControllers.forEach((controller) => {
      controller.classList.remove('controllerSelected')
    })

    photoControllers[currentIndex].classList.add('controllerSelected')

    // Incrementa o índice atual
    currentIndex++

    // Se todas as fotos foram exibidas, reinicia o índice para começar do início
    if (currentIndex === photoNumber) {
      currentIndex = 0
    }

    return currentIndex
  }

  atualIndex = 0

  // Função principal do carrossel
  rollCarrossel(atualIndex = 0) {
    const attemptInterval = 62.5 // Intervalo entre as tentativas (5 segundos)
    const maxAttempts = 800 // Número máximo de tentativas

    const tryInitializeCarrossel = (attempts: number) => {
      const photoNumber = this.Registry?.class_photo.length
      if (photoNumber) {
        // Capturar todos os elementos com a classe "classPhotoContainer"
        const allPhotos = document.querySelectorAll(
          '.classPhotoContainer',
        ) as NodeListOf<HTMLElement>

        const photoControllers = document.querySelectorAll(
          '.sliderController',
        ) as NodeListOf<HTMLElement>

        // Verifica se os elementos foram encontrados
        if (allPhotos.length === 0 && attempts < maxAttempts) {
          // Tenta novamente após o intervalo
          setTimeout(
            () => tryInitializeCarrossel(attempts + 1),
            attemptInterval,
          )
          return
        }

        if (allPhotos.length === 0) {
          console.error(
            'Não foram encontrados elementos com a classe "classPhotoContainer".',
          )
          return
        }

        let currentIndex = atualIndex

        // Inicia a rolagem do carrossel a cada 8 segundos
        currentIndex = this.movePhotos(
          allPhotos,
          photoControllers,
          currentIndex,
          photoNumber,
        ) // Chamada inicial para começar imediatamente

        this.carrosselIntervalId = setInterval(() => {
          currentIndex = this.movePhotos(
            allPhotos,
            photoControllers,
            currentIndex,
            photoNumber,
          )
        }, 6000) // Repetir a cada 8 segundos
      } else {
        console.error(
          'Não foi possível encontrar o número de fotos no Registry.',
        )
      }
    }

    // Inicializa a função de tentativa
    tryInitializeCarrossel(0)
  }

  // Função para parar o carrossel
  stopCarrossel() {
    if (this.carrosselIntervalId !== null) {
      clearInterval(this.carrosselIntervalId)
      this.carrosselIntervalId = null
    }
  }

  selectPhoto(photoIndex: number) {
    const allPhotos = document.querySelectorAll(
      '.classPhotoContainer',
    ) as NodeListOf<HTMLElement>
    const photoControllers = document.querySelectorAll(
      '.sliderController',
    ) as NodeListOf<HTMLElement>

    const photoNumber = this.Registry?.class_photo.length || 0
    this.stopCarrossel()

    this.movePhotos(allPhotos, photoControllers, photoIndex, photoNumber)

    this.rollCarrossel(photoIndex)
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
