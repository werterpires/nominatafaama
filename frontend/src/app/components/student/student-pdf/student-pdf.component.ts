import { Component, ElementRef, ViewChild } from '@angular/core'
import { jsPDF } from 'jspdf'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { ICompleteStudent } from '../../approvals/student-to-approve/types'
import { DatePipe } from '@angular/common'
import { SafeResourceUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-student-pdf',
  templateUrl: './student-pdf.component.html',
  styleUrls: ['./student-pdf.component.css'],
})
export class StudentPdfComponent {
  @ViewChild('pdfPage') pdfPage!: ElementRef
  @ViewChild('pdfContainer') pdfContainer!: ElementRef

  alonePhoto: SafeResourceUrl | null = null
  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null

  student!: ICompleteStudent
  constructor(private dataService: DataService, public datePipe: DatePipe) {}

  ngOnInit() {
    console.log('joaqui')
    this.student = this.dataService.sendStudent()
    this.alonePhoto = this.dataService.sendAlonePhoto()
    console.log(this.student)
  }

  printPDF() {
    let pdf = new jsPDF('l', 'pt', 'a4')

    pdf.html(this.pdfContainer.nativeElement, {
      callback: (pdf) => {
        pdf.save('Teste.pdf')
      },
    })
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
