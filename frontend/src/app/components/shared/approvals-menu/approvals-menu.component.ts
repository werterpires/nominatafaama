import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-approvals-menu',
  templateUrl: './approvals-menu.component.html',
  styleUrls: ['./approvals-menu.component.css'],
})
export class ApprovalsMenuComponent {
  @Output() approvalType = new EventEmitter<string>()

  choseUsers() {
    this.approvalType.emit('users')
  }

  choseStudents() {
    this.approvalType.emit('students')
  }
}
