import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IBasicInviteData } from './types'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css'],
})
export class InvitesComponent implements OnInit {
  error = false

  @Output() createInviteEvent = new EventEmitter<IBasicInviteData>()
  @Output() closeEvent = new EventEmitter<void>()

  @Input() notice = true

  createInviteData: IBasicInviteData = {
    voteDate: '',
    voteNumber: '',
    deadline: '',
  }

  constructor(private errorService: ErrorServices) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe((error) => (this.error = error))
  }

  createInvite() {
    if (
      this.createInviteData.voteDate.length < 6 ||
      this.createInviteData.voteNumber.length < 1 ||
      this.createInviteData.deadline.length < 6
    ) {
      this.errorService.showError('Todos os campos devem ser preenchidos.')
      return
    }
    this.createInviteEvent.emit(this.createInviteData)
  }

  closeInvite() {
    this.closeEvent.emit()
  }
}
