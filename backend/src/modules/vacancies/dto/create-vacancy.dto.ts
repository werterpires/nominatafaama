import { IsNumber, IsString, isNumber } from 'class-validator'

export class CreateVacancyDto {
  @IsNumber()
  ministryId: number

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  hiringStatusId: number

  @IsNumber()
  nominataId: number
}

export class CreateDirectVacancyDto {
  @IsNumber()
  student_id: number

  @IsNumber()
  field_id: number

  @IsNumber()
  hiring_status_id: number
}
