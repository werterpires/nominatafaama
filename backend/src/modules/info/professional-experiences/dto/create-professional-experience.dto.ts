import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class CreateProfessionalExperienceDto {
  @IsNotEmpty()
  job: string

  @IsNotEmpty()
  job_institution: string

  @IsNotEmpty()
  @IsDateString()
  job_begin_date: string

  @IsDateString()
  @IsOptional()
  job_end_date?: string
}
