import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IUser } from 'src/app/components/records/users/types'
import { ApproveUserObj, GetUserObj } from './types'
import { IRole } from 'src/app/components/shared/container/types'

@Component({
  selector: 'app-aprove-by-user-type',
  templateUrl: './aprove-by-user-type.component.html',
  styleUrls: ['./aprove-by-user-type.component.css'],
})
export class AproveByUserTypeComponent {
  @Output() approveUserEmmiter: EventEmitter<ApproveUserObj> =
    new EventEmitter()
  @Output() getUsersEmmiter: EventEmitter<GetUserObj> = new EventEmitter()
  status: boolean | null = null
  _userType = ''

  @Input() users: IUser[] = []
  @Input() userTitle = ''

  @Input() set userType(userType: string) {
    this._userType = userType
    this.getUsers()
  }

  getUsers() {
    if (!this._userType) {
      return
    }
    this.getUsersEmmiter.emit({
      status: this.status,
      requiredRole: this._userType,
    })
  }

  approveUser(
    approveString: boolean | null | undefined,
    userId: number,
    userRoles: IRole[],
  ) {
    if (approveString == undefined) {
      return
    }
    const approveUserObj: ApproveUserObj = {
      approveString,
      userId,
      userRoles,
    }
    this.approveUserEmmiter.emit(approveUserObj)
  }
}
