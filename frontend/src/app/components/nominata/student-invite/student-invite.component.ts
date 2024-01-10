import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IEvent } from '../../parameterization/events/types'
import { DatePipe } from '@angular/common'
import { environment } from 'src/environments/environment'

declare const html2pdf: any
@Component({
  selector: 'app-student-invite',
  templateUrl: './student-invite.component.html',
  styleUrls: ['./student-invite.component.css'],
})
export class StudentInviteComponent {
  @Input() events: IEvent[] | null = []
  @Input() nominataId: number | null = null
  @Input() urlBase: string | null = null
  @Input() year: string | null = null

  @Output() done = new EventEmitter<void>()

  constructor(private datePipe: DatePipe) {}

  formatDate(date: string | null) {
    if (!date) {
      return 'em andamento'
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  generatePDF() {
    try {
      const pdfContainer = document.querySelector('#inviteContainer')

      if (!pdfContainer) return

      const rect = pdfContainer?.getBoundingClientRect()

      const options = {
        margin: [0, 0],
        filename: 'Convite' + this.year,
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
      this.done.emit()
    } catch (error) {
      console.log(error)
    }
  }
}
