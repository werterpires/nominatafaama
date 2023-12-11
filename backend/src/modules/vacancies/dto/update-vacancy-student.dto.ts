import { PartialType } from '@nestjs/mapped-types'
import { CreateVacancyDto } from './create-vacancy.dto'
import { IsNumber, IsString } from 'class-validator'

export class UpdateVacancyStudentDto {
  @IsNumber()
  vacancyStudentId: number

  @IsString()
  comments: string
}
