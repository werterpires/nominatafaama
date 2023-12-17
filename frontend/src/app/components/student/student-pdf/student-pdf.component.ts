import {
  AfterViewInit,
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
// import { jsPDF } from 'jspdf'

declare const html2pdf: any

@Component({
  selector: 'app-student-pdf',
  templateUrl: './student-pdf.component.html',
  styleUrls: ['./student-pdf.component.css'],
})
export class StudentPdfComponent implements OnInit, AfterViewInit {
  @ViewChildren('pdfPage') pdfPages!: QueryList<ElementRef>
  @ViewChild('pdfContainer') pdfContainer!: ElementRef
  @ViewChild('background1') background1!: ElementRef
  @ViewChild('alonePhoto') alonePhoto!: ElementRef

  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null

  @Input() student!: ICompleteStudent
  constructor(
    private renderer: Renderer2,
    private dataService: DataService,
    public datePipe: DatePipe,
  ) {}

  async formatAndGeneratePdf() {
    await this.fontSizeDown()
    this.generatePDF()
  }

  async fontSizeDown() {
    const parentElements = document.querySelectorAll('.informationGroup')

    if (!parentElements) return

    parentElements.forEach((parentElement) => {
      let hasOverflowY = this.getIsOverflow(parentElement)
      if (!hasOverflowY) return
      let contador = 0
      while (hasOverflowY && contador < 300) {
        contador++
        const infos = parentElement.querySelectorAll('.infoContent')
        const computedStyle = window.getComputedStyle(infos[0])

        const currentFontSize = parseFloat(
          computedStyle.getPropertyValue('font-size'),
        )

        const newSize = currentFontSize * 0.99

        infos.forEach((info) => {
          const infoElement = info as HTMLElement
          infoElement.style.fontSize = `${newSize}px`
        })

        hasOverflowY = this.getIsOverflow(parentElement)
      }
    })

    return true
  }

  getIsOverflow(element: Element) {
    return element.scrollHeight > element.clientHeight
  }

  generatePDF() {
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

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', (e) => {
      this.fontSizeDown()
    })
  }

  urlBase = environment.API
  ngOnInit() {
    this.student = this.dataService.sendStudent()
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
}
