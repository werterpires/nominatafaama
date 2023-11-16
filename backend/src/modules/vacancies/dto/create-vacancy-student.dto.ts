import { IsNumber, IsString, isNumber } from 'class-validator'

export class CreateVacancyStudentDto {
  @IsNumber()
  studentId: number
  @IsNumber()
  vacancyId: number
  @IsString()
  comments: string
}
