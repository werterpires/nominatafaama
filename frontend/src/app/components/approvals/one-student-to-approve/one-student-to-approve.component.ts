import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../student-to-approve/types'
import { SafeResourceUrl } from '@angular/platform-browser'

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
  }

  alonePhoto: SafeResourceUrl | null = null

  constructor(private dataService: DataService) {}

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

  approveStudent(
    approveStudent: string,
    rejectStudent: string,
    student_id: number,
  ) {
    console.log(approveStudent, rejectStudent, student_id)
  }
}
