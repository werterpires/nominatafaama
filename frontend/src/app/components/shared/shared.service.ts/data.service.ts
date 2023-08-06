import { Injectable } from '@angular/core'
import { ICompleteStudent } from '../../approvals/student-to-approve/types'
import { INominata } from '../../parameterization/nominatas/types'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  maritalStatusName!: string
  selectedStudent!: ICompleteStudent
  nominatas!: INominata[]

  dateFormatter(date: string) {
    const objectDate = new Date(date)
    return `${
      objectDate.getUTCMonth() + 1
    }/${objectDate.getUTCDate()}/${objectDate.getUTCFullYear()}`
  }
}
