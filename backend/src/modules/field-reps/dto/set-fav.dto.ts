import { IsNumber } from 'class-validator'

export class SetFavDto {
  @IsNumber()
  studentId: number
}
