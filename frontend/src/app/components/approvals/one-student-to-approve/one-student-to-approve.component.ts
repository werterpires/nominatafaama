import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core'
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
import { ApproveFormServices } from '../../shared/approve-form/approve-form.service'
import { Subscription } from 'rxjs'
import { AssociationService } from '../../parameterization/associations/associations.service'
import { IAssociation } from '../../parameterization/associations/types'
import { IMaritalStatus } from '../../parameterization/marital-status/types'
import { MaritalStatusService } from '../../parameterization/marital-status/marital-status.service'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'
import { IUF } from '../../shared/types'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { IMinistryType } from '../../parameterization/minstry-types/types'
import { MinistryTypesService } from '../../parameterization/minstry-types/ministry-types.service'

@Component({
  selector: 'app-one-student-to-approve',
  templateUrl: './one-student-to-approve.component.html',
  styleUrls: ['./one-student-to-approve.component.css'],
})
export class OneStudentToApproveComponent implements OnInit, OnDestroy {
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

  allAssociations: IAssociation[] = []
  allMaritalStatus: IMaritalStatus[] = []
  allStates: IUF[] = []
  ministryTypeList: IMinistryType[] = []

  isLoading = false
  done = false
  doneMessage = ''
  error = false

  @ViewChildren('saveButton') saveButtons!: QueryList<ElementRef>

  constructor(
    private dataService: DataService,
    private service: OneStudentToApproveService,
    private studentToApproveService: StudentsToApproveService,
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    private approveFormService: ApproveFormServices,
    private associationService: AssociationService,
    private maritalStatusService: MaritalStatusService,
    private errorService: ErrorServices,
    private otherService: OthersServices,
    private ministryTypeService: MinistryTypesService,
  ) {}

  userId!: number
  user: IUserApproved | null = null

  private atualizeStudentSub!: Subscription

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
          !roles.includes('direção') &&
          !roles.includes('ministerial') &&
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
      this.permissions.representacao = roles.includes('representante de campo')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
    })
    this.errorService.error$.subscribe((error) => {
      this.error = error
    })

    this.activatedRoute.paramMap.subscribe((params) => {
      const userId = params.get('userId')

      if (userId) {
        this.userId = parseInt(userId)
      }
    })
    this.getOneStudent(this.userId)
    this.getAllAssociations()
    this.getAllMaritalStatus()
    this.getAllStates()
    this.getAllMinistryTypes()

    this.atualizeStudentSub = this.approveFormService
      .atualizeStudentObservable()
      .subscribe(() => {
        console.log('recarregando')
        location.reload()
      })
  }

  async getAllAssociations() {
    this.associationService.findAllRegistries().subscribe((associations) => {
      this.allAssociations = associations
    })
  }

  async getAllMaritalStatus() {
    this.maritalStatusService.findAllRegistries().subscribe({
      next: (maritalStatus) => {
        this.allMaritalStatus = maritalStatus
      },
      error: (err) => {
        this.errorService.showError(err.message)
      },
    })
  }

  async getAllStates() {
    this.otherService.findAllStates().subscribe({
      next: (res) => {
        this.allStates = res
      },
      error: (err) => {
        this.errorService.showError(err.message)
      },
    })
  }

  async getAllMinistryTypes() {
    this.ministryTypeService.findAllRegistries().subscribe({
      next: (res) => {
        this.ministryTypeList = res
      },
      error: (err) => {
        this.errorService.showError(err.message)
      },
    })
  }

  async getOneStudent(userId: number) {
    this.isLoading = true
    this.service.findOneRegistry(userId).subscribe({
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

        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
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
      next: () => {
        if (this.student.user) {
          this.atualizeStudent()
        }
        this.doneMessage = 'Aprovação feita com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  atualizeStudent() {
    this.isLoading = true

    if (!this.student.user?.user_id) return
    this.studentToApproveService
      .findOneRegistry(this.student.user.user_id)
      .subscribe({
        next: (res) => {
          this.student = res
          this.isLoading = false
        },
        error: (err) => {
          this.errorService.showError(err.message)
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
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  saveAll() {
    try {
      this.isLoading = true

      this.approveFormService.approveAll()

      this.isLoading = false
      return
      this.saveButtons.forEach((button) => {
        button.nativeElement.click()
      })

      if (this.student.user) {
        this.atualizeStudent()
      }
      this.getOneStudent(this.userId)
      this.doneMessage = 'Aprovação feita com sucesso.'
      this.done = true
      this.isLoading = false
    } catch (error: any) {
      this.errorService.showError(error.message)
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

  closeDone() {
    this.done = false
  }

  ngOnDestroy() {
    this.atualizeStudentSub.unsubscribe()
  }
}
