import { PartialType } from '@nestjs/mapped-types'
import { CreateVacancyDto } from './create-vacancy.dto'
import { IsNumber, IsString } from 'class-validator'

export class UpdateVacancyDto {
  @IsNumber()
  vacancyId: number

  @IsNumber()
  ministryId: number

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  hiringStatusId: number
}
