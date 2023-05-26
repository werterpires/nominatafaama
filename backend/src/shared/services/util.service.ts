/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'

@Injectable()
export class UtilService {
  static toDateString(date: Date) {
    return `${date.toJSON().substring(0, 10)}` as unknown as Date
  }
}
