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

  @Input() fav = false

  @Output() setFavEmiter: EventEmitter<{ studentId: number; fav: boolean }> =
    new EventEmitter<{ studentId: number; fav: boolean }>()

  setFav(fav: boolean) {
    this.setFavEmiter.emit({ studentId: this.student.student_id, fav: fav })
  }
}
