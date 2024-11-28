import { Injectable } from '@angular/core'
import { ICompleteStudent } from '../../approvals/student-to-approve/types'
import { INominata } from '../../parameterization/nominatas/types'
import { SafeResourceUrl } from '@angular/platform-browser'
import { ThisReceiver } from '@angular/compiler'
import { IAssociation } from '../../parameterization/associations/types'
import { ICity, IUF } from '../types'
import { OthersServices } from './others.service'
import { IStudent } from '../../records/students/types'
import { ErrorServices } from './error.service'

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

  constructor(
    private otherService: OthersServices,
    private errorService: ErrorServices,
  ) {}

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
  formatarTelefone(phoneNumber: string) {
    let formatedNumber = ''
    phoneNumber = phoneNumber.replace(/\D/g, '')

    if (phoneNumber.length > 0) {
      formatedNumber = '(' + phoneNumber.substring(0, 2) + ') '
    }
    if (phoneNumber.length > 2) {
      formatedNumber += phoneNumber.substring(2, 6) + '-'
    }
    if (phoneNumber.length > 7) {
      formatedNumber += phoneNumber.substring(6, 10)
    }
    if (phoneNumber.length == 11) {
      formatedNumber = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      )
    }

    return formatedNumber
  }

  filterAssociation(
    possibleAssociantions: IAssociation[],
    allAssociations: IAssociation[],
    unionAcronym: string,
    change?: boolean,
  ) {
    possibleAssociantions.splice(0, possibleAssociantions.length)
    const filtered = allAssociations.filter((association) => {
      return association.union_acronym == unionAcronym
    })
    possibleAssociantions.push(...filtered)

    if (change) {
      return possibleAssociantions[0].association_id
    }
    return 0
  }

  findCities(
    sigla: string,
    allStates: IUF[],
    citiesArray: ICity[],
    atualCity: string,
  ) {
    const state = allStates.find((state) => state.sigla === sigla)
    let cityToReturn = ''
    if (state) {
      this.otherService.findAllCities(state.id).subscribe({
        next: (res) => {
          citiesArray.splice(0, citiesArray.length)
          citiesArray.push(...res)
          if (!citiesArray.find((cit) => cit.nome === atualCity)) {
            cityToReturn = ''
          }
          cityToReturn = atualCity
        },
        error: (err) => {
          this.errorService.showError(err.message)
        },
      })
      return cityToReturn
    } else {
      console.error('State Id not found.')
      return atualCity
    }
  }
}
