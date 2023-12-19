import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core'
// import { jsPDF } from 'jspdf'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../../approvals/student-to-approve/types'
import { DatePipe } from '@angular/common'
import { SafeResourceUrl } from '@angular/platform-browser'
import { environment } from 'src/environments/environment'
import { IEvangelisticExperience } from '../../records/evg-experiences/types'
import { IPublication } from '../../records/publications/types'
// import { jsPDF } from 'jspdf'

declare const html2pdf: any

@Component({
  selector: 'app-student-pdf',
  templateUrl: './student-pdf.component.html',
  styleUrls: ['./student-pdf.component.css'],
})
export class StudentPdfComponent implements OnInit {
  @ViewChildren('pdfPage') pdfPages!: QueryList<ElementRef>
  @ViewChild('pdfContainer') pdfContainer!: ElementRef
  @ViewChild('background1') background1!: ElementRef
  @ViewChild('alonePhoto') alonePhoto!: ElementRef

  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null

  @Input() student!: ICompleteStudent
  @Input() evvangExpTypes: string[] = []
  @Input() spEvvangExpTypes: string[] = []
  @Input() publicationTypes: string[] = []
  @Input() spPublicationTypes: string[] = []
  constructor(
    private renderer: Renderer2,
    private dataService: DataService,
    public datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.expByTypes = this.classifyEvangTypes(
      this.student.evangelisticExperiences || [],
    )
    this.spExpByTypes = this.classifyEvangTypes(
      this.student.spEvangelisticExperiences || [],
    )
    this.pubByTypes = this.classifyPublicationsTypes(
      this.student.publications || [],
    )
    this.spPubByTypes = this.classifyPublicationsTypes(
      this.student.spPublications || [],
    )
  }

  async formatAndGeneratePdf() {
    await this.fontSizeDown()
    this.generatePDF()
  }

  async fontSizeDown() {
    const parentElements = document.querySelectorAll(
      '.informationGroup, .informationPage',
    )

    if (!parentElements) return

    parentElements.forEach((parentElement) => {
      let hasOverflowY = this.getIsOverflow(parentElement)
      console.log(parentElement, hasOverflowY)

      if (!hasOverflowY) return
      let contador = 0
      while (hasOverflowY && contador < 300) {
        contador++
        const infos = parentElement.querySelectorAll('.infoContent')

        const computedStyle = window.getComputedStyle(infos[0])

        const currentFontSize = parseFloat(
          computedStyle.getPropertyValue('font-size'),
        )

        const currentLetterSpacing = parseFloat(
          computedStyle.getPropertyValue('letter-spacing'),
        )

        const currentLineHeight = parseFloat(
          computedStyle.getPropertyValue('line-height'),
        )

        const newSize = currentFontSize * 0.99
        const newLetterSpacing = currentLetterSpacing * 0.98
        const newLineHeight = currentLineHeight * 0.98

        infos.forEach((info) => {
          const infoElement = info as HTMLElement
          infoElement.style.fontSize = `${newSize}px`
          infoElement.style.letterSpacing = `${newLetterSpacing}px`
          infoElement.style.lineHeight = `${newLineHeight}px`
        })

        hasOverflowY = this.getIsOverflow(parentElement)
      }
    })

    return true
  }

  getIsOverflow(element: Element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    )
  }

  generatePDF() {
    console.log('começando a gerar pdf')
    try {
      const pdfContainer = document.querySelector('.pdfContainer')

      if (!pdfContainer) return

      const rect = pdfContainer?.getBoundingClientRect()

      const options = {
        margin: [0, 0],
        filename: this.student.student?.person_name || 'curriculo',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          backgroundColor: null,
          scale: 2,
          width: 1122.515625,

          y: rect.y * -1,

          allowTaint: true,
          useCORS: true,
          proxy: environment.API,
        },
        jsPDF: { format: 'a2', orientation: 'landscape' },
      }

      html2pdf().from(pdfContainer).set(options).save()
    } catch (error) {
      console.log(error)
    }
  }

  urlBase = environment.API

  expByTypes: { [key: string]: IEvangelisticExperience[] } = {}
  spExpByTypes: { [key: string]: IEvangelisticExperience[] } = {}
  pubByTypes: { [key: string]: IPublication[] } = {}
  spPubByTypes: { [key: string]: IPublication[] } = {}

  classifyEvangTypes(exps: IEvangelisticExperience[]) {
    const xpByType: { [key: string]: IEvangelisticExperience[] } = {}

    exps.forEach((exp) => {
      if (!xpByType[exp.evang_exp_type_name]) {
        xpByType[exp.evang_exp_type_name] = []
      }
      xpByType[exp.evang_exp_type_name].push(exp)
    })

    return xpByType
  }

  classifyPublicationsTypes(publications: IPublication[]) {
    const pubByTypes: { [key: string]: IPublication[] } = {}
    publications.forEach((pub) => {
      if (!pubByTypes[pub.publication_type]) {
        pubByTypes[pub.publication_type] = []
      }
      pubByTypes[pub.publication_type].push(pub)
    })
    return pubByTypes
  }

  formatDate(date: string | null) {
    if (!date) {
      return 'em andamento'
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  formatConclusionYear(date: string | null) {
    if (date == null) {
      return 'em andamento'
    }
    const today = new Date()
    const inputDate = new Date(date)

    if (inputDate > today) {
      return 'em andamento'
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
}
