import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../student-to-approve/types'
import { SafeResourceUrl } from '@angular/platform-browser'
import { OneStudentToApproveService } from './one-student-to-approve.service'
import { ApproveUserDto } from '../../approves/users-approves/types'
import { ApproveDto } from './types'
import { StudentsToApproveService } from '../student-to-approve/student-to-approve.service'
import { ViewChildren, QueryList, ElementRef } from '@angular/core'

@Component({
  selector: 'app-one-student-to-approve',
  templateUrl: './one-student-to-approve.component.html',
  styleUrls: ['./one-student-to-approve.component.css'],
})
export class OneStudentToApproveComponent {
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
  @ViewChildren('saveButton') saveButtons!: QueryList<ElementRef>

  constructor(
    private dataService: DataService,
    private service: OneStudentToApproveService,
    private studentToApproveService: StudentsToApproveService,
  ) {}

  async ngOnInit() {
    this.student = this.dataService.selectedStudent
    if (this.student.evangelisticExperiences != null) {
      this.student.evangelisticExperiences.forEach((experience) => {
        if (!this.evvangExpTypes.includes(experience.evang_exp_type_name)) {
          this.evvangExpTypes.push(experience.evang_exp_type_name)
        }
      })
    }
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
  }

  async getFile(data: any, photo: string) {
    const blob1 = new Blob([new Uint8Array(data)], {
      type: 'image/jpeg',
    })
    if (blob1 instanceof Blob) {
      console.log('sim')

      const reader = new FileReader()
      reader.onload = (e: any) => {
        if (photo == 'alone') {
          this.alonePhoto = e.target.result
        } else if (photo == 'spouse') {
          this.spousePhoto = e.target.result
        } else if (photo == 'family') {
          this.familyPhoto = e.target.result
        }
      }
      reader.readAsDataURL(blob1)
    } else {
      console.log('não')
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
    console.log(table, approve, id)
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
      next: (res) => {},
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
    console.log(table, approve, id)
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
      this.doneMessage = 'Aprovação feita com sucesso.'
      this.done = true
      this.isLoading = false
    } catch (error) {
      this.errorMessage = this.errorMessage
      this.error = true
      this.isLoading = false
    }
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
