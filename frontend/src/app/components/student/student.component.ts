import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { IPermissions, IUserApproved } from '../shared/container/types'
import { ActivatedRoute } from '@angular/router'
import { StudentService } from './student.service'
import { ICompleteStudent } from '../approvals/student-to-approve/types'
import { DatePipe } from '@angular/common'
import { SafeResourceUrl } from '@angular/platform-browser'
import { DataService } from '../shared/shared.service.ts/data.service'
import { environment } from 'src/environments/environment'
import { LoginService } from '../shared/shared.service.ts/login.service'
import { StudentsSpaceService } from '../nominata/students-space/students-space.service'

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
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
  @ViewChild('whiteSpace') whiteSpaceElement!: ElementRef

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  pdf = false

  student: ICompleteStudent = {
    student: null,
    spouse: null,
    previousMarriage: null,
    eclExperiences: null,
    ordinations: null,
    children: null,
    academicFormations: null,
    spAcademicFormations: null,
    languages: null,
    spLanguages: null,
    courses: null,
    spCourses: null,
    professionalExperiences: null,
    spProfessionalExperiences: null,
    pastEclExps: null,
    spPastEclExps: null,
    evangelisticExperiences: null,
    spEvangelisticExperiences: null,
    publications: null,
    spPublications: null,
    endowments: null,
    spEndowments: null,
    relatedMinistries: null,
    spRelatedMinistries: null,
    photos: null,
    user: null,
  }

  alonePhoto: SafeResourceUrl | null = null
  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null
  smallAlonePhoto: SafeResourceUrl | null = null

  evvangExpTypes: string[] = []
  spEvvangExpTypes: string[] = []
  publicationTypes: string[] = []
  spPublicationTypes: string[] = []

  firstName!: string
  surname!: string

  links: { [key: string]: string } = {
    l13: '1or8iTtUzx6lmZWPJTss7yrQpDIYe5m-5',
    l17: '1U-V-DRenG3lZWDsWqbhkzTnnjcoOAaKz',
    l26: '15M7S6kXklZHIKb6xS6MabH9q1L-3Aa03',
    l24: '143HsIDY_GesY4q6Fjyt08p4HfSjvyQ54',
    l22: '1QMyw1FyKNOGFOrZa-d4bEM8W7bvTL9QA',
    l14: '1oXubzs-nuMftIBgBXOH3T_xltWphCFZe',
    l15: '11o3ZnrjikEQh-wSuuDBXfkHN3jZGpWWx',
    l23: '1Dsdoi3Sre19oujWvhMGg0TTa6M1oKmod',
    l10: '139NILPcQIYyrc1Qje0zOBfQXosBrWkK7',
    l20: '17U3D4YyWRL0VoVMQEvzQEMHzyO2utLvB',
    l182: '14Eq3kcjCKlt9tGwAJLvspjULyar4Jq7A',
    l18: '1bKiTKo2rWUe5Mto7Mnzm7T7U9eC0ECGf',
    l19: '1CNtH5tuqtCijXY8-kyi8Cwh1Huiv_YRa',
    l11: '1v0Sd1JxSpg-NK-qVJ4BDbgIwKbyqObC8',
    l8: '1jKYGV1-T8gDQHVqO-0mjiRt3ybCzmJDB',
    l136: '1XaHDiJvBcAnhxbJul19vY07p226Vp4lT',
    l101: '1Rglx6AOl5POuLKPC3zRPLzROZWetbAUi',
    l21: '1XjfOLvhvVKOt8yIqGGhCjEuiDq5BW112',
    l27: '1noLV10wCHZVUGeJuzvjlP38xNF2eckY0',
    l5: '1E9zijDoqNaAhKbfpYPGFfv3bkgPcDIKN',
    l12: '1ldUU9MBsOwKRuLD48LG7Ilw_MKFUR20H',
    l178: '1Fp6p1sW-lCDZnq1jg9p61QugpCSkvxuQ',
    l9: '1jsqZyhbf5Dcb3LudsNoZL3de61Fu3G83',
    l32: '11Uo8RGq7d4ocHVLVvNB-98DhjxSjFHb7',
    l28: '1V7ZkiKlBDB27T2-tuUATns5Uc7VPILS6',
    l29: '1sc3ojBzBBuQsp6GwAFdXsvIW_ax9vwKc',
  }

  curriculumLink!: string
  router: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: StudentService,
    public datePipe: DatePipe,
    private dataService: DataService,
    private loginService: LoginService,
    private studentsSpaceService: StudentsSpaceService,
  ) {}

  @Input() studentId!: number

  urlBase = environment.API

  user: IUserApproved | null = null

  ngOnInit(): void {
    this.isLoading = true

    this.loginService.user$.subscribe((user) => {
      this.isLoading = true
      if (user === 'wait') {
        this.isLoading = false
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
      this.isLoading = false
    })

    this.activatedRoute.paramMap.subscribe((params) => {
      const studentId = params.get('studentid')

      if (studentId) {
        this.studentId = parseInt(studentId)
      }
    })
    this.isLoading = true
    this.service.findOneRegistry(this.studentId).subscribe({
      next: async (res) => {
        this.student = res

        if (this.student.evangelisticExperiences != null) {
          this.student.evangelisticExperiences.forEach((experience) => {
            if (!this.evvangExpTypes.includes(experience.evang_exp_type_name)) {
              this.evvangExpTypes.push(experience.evang_exp_type_name)
            }
          })
        }
        if (this.student.spEvangelisticExperiences != null) {
          this.student.spEvangelisticExperiences.forEach((experience) => {
            if (
              !this.spEvvangExpTypes.includes(experience.evang_exp_type_name)
            ) {
              this.spEvvangExpTypes.push(experience.evang_exp_type_name)
            }
          })
        }
        if (this.student.publications != null) {
          this.student.publications.forEach((publication) => {
            if (!this.publicationTypes.includes(publication.publication_type)) {
              this.publicationTypes.push(publication.publication_type)
            }
          })
        }
        if (this.student.spPublications != null) {
          this.student.spPublications.forEach((publication) => {
            if (
              !this.spPublicationTypes.includes(publication.publication_type)
            ) {
              this.spPublicationTypes.push(publication.publication_type)
            }
          })
        }
        if (this.student.student) {
          this.firstName = this.student.student.person_name.split(' ')[0]
          this.surname = this.student.student.person_name
            .split(' ')
            .slice(1)
            .join(' ')
        }

        const key = 'l' + this.student.student?.person_id
        this.curriculumLink =
          'https://drive.google.com/uc?export=download&id=' + this.links[key]
        this.dataService.receiveStudent(
          this.student,
          this.alonePhoto,
          this.spousePhoto,
          this.familyPhoto,
        )
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    this.getAllFavs()
    this.isLoading = false
  }

  favorites: number[] = []

  getAllFavs() {
    this.studentsSpaceService.findAllFavs().subscribe({
      next: (res) => {
        this.favorites = res
        this.isLoading = false
      },
      error: (error) => {
        this.favorites = []
        this.isLoading = false
      },
    })
  }

  setFav(studentId: number) {
    this.isLoading = true
    this.studentsSpaceService.setFavs({ studentId }).subscribe({
      next: (res) => {
        this.favorites = res
        this.isLoading = false
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
        this.isLoading = false
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false
      },
    })
  }

  scrollMoved = false

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.scrollMoved) {
      this.growWhiteSpace()

      this.scrollMoved = true
    }
  }

  growWhiteSpace() {
    if (this.student.student) {
      this.isLoading = true

      const contentHeight = document.body.scrollHeight - 640

      const divElement = this.whiteSpaceElement.nativeElement

      divElement.style.height = contentHeight + 'px'
      this.isLoading = false
    }
  }

  // async getFile(data: any, photo: string) {
  //   const blob1 = new Blob([new Uint8Array(data)], {
  //     type: 'image/jpeg',
  //   })
  //   if (blob1 instanceof Blob) {
  //     const reader = new FileReader()
  //     reader.onload = (e: any) => {
  //       if (photo == 'alone') {
  //         this.alonePhoto = e.target.result
  //       } else if (photo == 'spouse') {
  //         this.spousePhoto = e.target.result
  //       } else if (photo == 'family') {
  //         this.familyPhoto = e.target.result
  //       } else if (photo == 'small_alone') {
  //         this.smallAlonePhoto = e.target.result
  //       }
  //     }
  //     reader.readAsDataURL(blob1)
  //   }
  // }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  formatConclusionYear(date: string | null) {
    if (date == null) {
      return 'Não concluído'
    }
    const today = new Date()
    const inputDate = new Date(date)

    if (inputDate > today) {
      return 'Não concluído'
    }

    return this.datePipe.transform(date, 'yyyy')
  }

  formateAge(date: string) {
    return Math.floor(
      (new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25),
    )
  }

  formatarTelefone(phoneNumber: string) {
    let formatedNumber = ''
    phoneNumber = phoneNumber.replace(/\D/g, '')

    if (phoneNumber.length > 0) {
      formatedNumber = '(' + phoneNumber.substring(0, 2) + ') '
    }
    if (phoneNumber.length > 2) {
      formatedNumber += phoneNumber.substring(2, 6) + '-'
    }
    if (phoneNumber.length > 7) {
      formatedNumber += phoneNumber.substring(6, 10)
    }
    if (phoneNumber.length == 11) {
      formatedNumber = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      )
    }

    return formatedNumber
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
