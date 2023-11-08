import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPermissions } from '../container/types'

@Component({
  selector: 'app-approvals-menu',
  templateUrl: './approvals-menu.component.html',
  styleUrls: ['./approvals-menu.component.css'],
})
export class ApprovalsMenuComponent {
  @Output() approvalType = new EventEmitter<string>()

  @Input() permissions!: IPermissions

  choseUsers() {
    this.approvalType.emit('users')
  }

  choseStudents() {
    this.approvalType.emit('students')
  }

  choseRepresentations() {
    this.approvalType.emit('representations')
  }
}
