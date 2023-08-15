import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { IPermissions } from '../shared/container/types'
import { ActivatedRoute } from '@angular/router'
import { StudentService } from './student.service'
import { ICompleteStudent } from '../approvals/student-to-approve/types'
import { DatePipe } from '@angular/common'
import { SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent {
  @Input() permissions!: IPermissions
  @ViewChild('whiteSpace') whiteSpaceElement!: ElementRef

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  student!: ICompleteStudent

  alonePhoto: SafeResourceUrl | null = null
  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null
  smallAlonePhoto: SafeResourceUrl | null = null

  evvangExpTypes: string[] = []
  spEvvangExpTypes: string[] = []
  publicationTypes: string[] = []
  spPublicationTypes: string[] = []

  constructor(
    private route: ActivatedRoute,
    private service: StudentService,
    public datePipe: DatePipe,
  ) {}

  @Input() studentId!: number

  ngOnInit(): void {
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

        await this.getFile(this.student.photos?.alone_photo?.file.data, 'alone')
        await this.getFile(
          this.student.photos?.small_alone_photo?.file.data,
          'small_alone',
        )
        await this.getFile(
          this.student.photos?.spouse_photo?.file.data,
          'spouse',
        )
        await this.getFile(
          this.student.photos?.family_photo?.file.data,
          'family',
        )
        // this.ngAfterViewInit()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  ngAfterViewInit() {
    this.isLoading = true
    const contentHeight = document.body.scrollHeight - 640
    console.log('passo 1')
    const divElement = this.whiteSpaceElement.nativeElement
    console.log('passo 2')

    divElement.style.height = contentHeight + 'px'
    this.isLoading = false
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
          this.smallAlonePhoto = e.target.result
        }
      }
      reader.readAsDataURL(blob1)
    } else {
    }
  }

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
