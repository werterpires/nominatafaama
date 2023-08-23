import { Injectable } from '@angular/core'
import { ICompleteStudent } from '../../approvals/student-to-approve/types'
import { INominata } from '../../parameterization/nominatas/types'
import { SafeResourceUrl } from '@angular/platform-browser'
import { ThisReceiver } from '@angular/compiler'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  maritalStatusName!: string
  selectedStudent!: ICompleteStudent
  nominatas!: INominata[]
  oneStudent!: ICompleteStudent
  alonePhoto: SafeResourceUrl | null = null
  spousePhoto: SafeResourceUrl | null = null
  familyPhoto: SafeResourceUrl | null = null

  receiveStudent(
    student: ICompleteStudent,
    alonePhoto: SafeResourceUrl | null,
    spousePhoto: SafeResourceUrl | null,
    familyPhoto: SafeResourceUrl | null,
  ) {
    this.oneStudent = student
    this.alonePhoto = alonePhoto
    this.spousePhoto = spousePhoto
    this.familyPhoto = familyPhoto
  }

  sendStudent() {
    return this.oneStudent
  }

  sendAlonePhoto() {
    return this.alonePhoto
  }

  dateFormatter(date: string) {
    const objectDate = new Date(date)
    return `${
      objectDate.getUTCMonth() + 1
    }/${objectDate.getUTCDate()}/${objectDate.getUTCFullYear()}`
  }
}
