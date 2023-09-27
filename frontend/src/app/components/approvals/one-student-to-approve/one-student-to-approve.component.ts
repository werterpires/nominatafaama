import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { IPermissions, IUserApproved } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../student-to-approve/types'
import { SafeResourceUrl } from '@angular/platform-browser'
import { OneStudentToApproveService } from './one-student-to-approve.service'
import { ApproveDto } from './types'
import { StudentsToApproveService } from '../student-to-approve/student-to-approve.service'
import { ViewChildren, QueryList, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { LoginService } from '../../shared/shared.service.ts/login.service'

@Component({
  selector: 'app-one-student-to-approve',
  templateUrl: './one-student-to-approve.component.html',
  styleUrls: ['./one-student-to-approve.component.css'],
})
export class OneStudentToApproveComponent implements OnInit {
  @Input() permissions!: IPermissions
  @Output() seeAll: EventEmitter<void> = new EventEmitter<void>()
  student: ICompleteStudent = {
    academicFormations: null,
    children: null,
    courses: null,
    eclExperiences: null,
    endowments: null,
    evangelisticExperiences: null,
    languages: null,
    ordinations: null,
    pastEclExps: null,
    photos: null,
    previousMarriage: null,
    professionalExperiences: null,
    publications: null,
    relatedMinistries: null,
    spAcademicFormations: null,
    spCourses: null,
    spEndowments: null,
    spEvangelisticExperiences: null,
    spLanguages: null,
    spouse: null,
    spPastEclExps: null,
    spProfessionalExperiences: null,
    spPublications: null,
    spRelatedMinistries: null,
    student: null,
    user: null,
  }

  evvangExpTypes: string[] = []
  spEvvangExpTypes: string[] = []
  publicationTypes: string[] = []
  spPublicationTypes: string[] = []

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  alonePhoto: SafeResourceUrl | null = null
  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null
  smallAllonePhoto: SafeResourceUrl | null = null
  @ViewChildren('saveButton') saveButtons!: QueryList<ElementRef>

  constructor(
    private dataService: DataService,
    private service: OneStudentToApproveService,
    private studentToApproveService: StudentsToApproveService,
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
  ) {}

  userId!: number
  user: IUserApproved | null = null

  async ngOnInit() {
    this.loginService.user$.subscribe((user) => {
      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []

      if (typeof user !== 'string' && user) {
        this.user = user

        roles = this.user.roles.map((role) => role.role_name.toLowerCase())
        if (
          !roles.includes('docente') &&
          !roles.includes('direcao') &&
          !roles.includes('administrador')
        ) {
          this.router.navigate(['nominata'])
        }

        this.permissions.isApproved = this.user.user_approved
      } else {
        this.user = null
        this.router.navigate(['nominata'])
        this.permissions.isApproved = false
      }
      this.permissions.estudante = roles.includes('estudante')
      this.permissions.secretaria = roles.includes('secretaria')
      this.permissions.direcao = roles.includes('direção')
      this.permissions.representacao = roles.includes('representacao')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
    })

    this.activatedRoute.paramMap.subscribe((params) => {
      const userId = params.get('userId')

      if (userId) {
        this.userId = parseInt(userId)
        this.getOneStudent(this.userId)
      }
    })

    if (this.student.spEvangelisticExperiences != null) {
      this.student.spEvangelisticExperiences.forEach((experience) => {
        if (!this.spEvvangExpTypes.includes(experience.evang_exp_type_name)) {
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
        if (!this.spPublicationTypes.includes(publication.publication_type)) {
          this.spPublicationTypes.push(publication.publication_type)
        }
      })
    }

    await this.getFile(this.student.photos?.alone_photo?.file.data, 'alone')
    await this.getFile(this.student.photos?.spouse_photo?.file.data, 'spouse')
    await this.getFile(this.student.photos?.family_photo?.file.data, 'family')
    await this.getFile(
      this.student.photos?.small_alone_photo?.file.data,
      'small_alone',
    )
  }

  getOneStudent(userId: number) {
    this.isLoading = true
    this.service.findOneRegistry(userId).subscribe({
      next: async (res) => {
        this.student = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  async getFile(data: any, photo: string) {
    const blob1 = new Blob([new Uint8Array(data)], {
      type: 'image/jpeg',
    })
    if (blob1 instanceof Blob) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        if (photo == 'alone') {
          this.alonePhoto = e.target.result
        } else if (photo == 'spouse') {
          this.spousePhoto = e.target.result
        } else if (photo == 'family') {
          this.familyPhoto = e.target.result
        } else if (photo == 'small_alone') {
          this.smallAllonePhoto = e.target.result
        }
      }
      reader.readAsDataURL(blob1)
    }
  }

  approve(
    table: string,
    elementTrue: HTMLInputElement,
    elementFalse: HTMLInputElement,
    id: number,
  ) {
    this.isLoading = true
    let approve: boolean | null = null

    if (elementTrue.checked) {
      approve = true
    } else if (elementFalse.checked) {
      approve = false
    } else {
      throw new Error('Você precisa escolher entre aprovado ou desaprovado.')
    }

    const data: ApproveDto = {
      approve: approve,
      id: id,
    }
    this.service.approveAny(data, table).subscribe({
      next: (res) => {
        if (this.student.user) {
          this.atualizeStudent(this.student.user.user_id)
        }
        this.doneMessage = 'Aprovação feita com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  atualizeStudent(id: number) {
    this.studentToApproveService.findOneRegistry(id).subscribe({
      next: (res) => {
        this.student = res
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  approveAll(
    table: string,
    elementTrue: HTMLInputElement,
    elementFalse: HTMLInputElement,
    id: number,
  ) {
    let approve: boolean | null = null

    if (elementTrue.checked) {
      approve = true
    } else if (elementFalse.checked) {
      approve = false
    } else {
      approve = true
    }

    const data: ApproveDto = {
      approve: approve,
      id: id,
    }
    this.service.approveAny(data, table).subscribe({
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  saveAll() {
    try {
      this.isLoading = true
      this.saveButtons.forEach((button) => {
        button.nativeElement.click()
      })
      if (this.student.user) {
        this.atualizeStudent(this.student.user.user_id)
      }
      this.getOneStudent(this.userId)
      this.doneMessage = 'Aprovação feita com sucesso.'
      this.done = true
      this.isLoading = false
    } catch (error) {
      this.errorMessage = this.errorMessage
      this.error = true
      this.isLoading = false
    }
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
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

  goBack() {
    this.seeAll.emit()
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
