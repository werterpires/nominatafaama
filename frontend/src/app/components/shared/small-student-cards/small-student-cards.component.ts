import { Component, EventEmitter, Input, Output } from '@angular/core'
import { environment } from 'src/environments/environment'
import { IPermissions } from '../container/types'
import { IBasicStudent } from '../../nominata/types'

@Component({
  selector: 'app-small-student-cards',
  templateUrl: './small-student-cards.component.html',
  styleUrls: ['./small-student-cards.component.css'],
})
export class SmallStudentCardsComponent {
  urlBase = environment.API
  ticket = false
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
  @Input() student!: IBasicStudent
  @Input() comments!: string
  @Input() commentsAllowed = false
  @Input() inviteState = ''

  @Input() fav = false

  @Output() setFavEmiter: EventEmitter<{ studentId: number; fav: boolean }> =
    new EventEmitter<{ studentId: number; fav: boolean }>()

  @Output() editEmiter: EventEmitter<{ comments: string }> = new EventEmitter<{
    comments: string
  }>()

  @Output() inviteEmiter: EventEmitter<void> = new EventEmitter<void>()

  readyToSave = false

  setFav(fav: boolean) {
    this.setFavEmiter.emit({ studentId: this.student.student_id, fav: fav })
  }

  edit() {
    this.editEmiter.emit({
      comments: this.comments,
    })
  }

  showTicket(show: boolean) {
    this.ticket = show
    console.log(this.ticket)
  }
}
