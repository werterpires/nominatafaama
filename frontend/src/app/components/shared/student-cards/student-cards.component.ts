import { Component, EventEmitter, Input, Output } from '@angular/core'
import { environment } from 'src/environments/environment'
import { IBasicStudent } from '../../nominata/types'
import { IPermissions } from '../container/types'

@Component({
  selector: 'app-student-cards',
  templateUrl: './student-cards.component.html',
  styleUrls: ['./student-cards.component.css'],
})
export class StudentCardsComponent {
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
