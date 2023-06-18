import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../student-to-approve/types'
import { SafeResourceUrl } from '@angular/platform-browser'
import { OneStudentToApproveService } from './one-student-to-approve.service'
import { ApproveUserDto } from '../../approves/users-approves/types'
import { ApproveDto } from './types'
import { StudentsToApproveService } from '../student-to-approve/student-to-approve.service'

@Component({
  selector: 'app-one-student-to-approve',
  templateUrl: './one-student-to-approve.component.html',
  styleUrls: ['./one-student-to-approve.component.css'],
})
export class OneStudentToApproveComponent {
  @Input() permissions!: IPermissions
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

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  alonePhoto: SafeResourceUrl | null = null

  constructor(
    private dataService: DataService,
    private service: OneStudentToApproveService,
    private studentToApproveService: StudentsToApproveService,
  ) {}

  async ngOnInit() {
    this.student = this.dataService.selectedStudent

    await this.getFile(this.student.photos?.alone_photo?.file.data)
  }

  async getFile(data: any) {
    const blob1 = new Blob([new Uint8Array(data)], {
      type: 'image/jpeg',
    })
    if (blob1 instanceof Blob) {
      console.log('sim')

      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.alonePhoto = e.target.result
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
        console.log(this.student)
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
