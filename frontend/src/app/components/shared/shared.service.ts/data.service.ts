import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  maritalStatusName!: string

  dateFormatter(date: string) {
    const objectDate = new Date(date)
    return `${
      objectDate.getUTCMonth() + 1
    }/${objectDate.getUTCDate()}/${objectDate.getUTCFullYear()}`
  }
}
