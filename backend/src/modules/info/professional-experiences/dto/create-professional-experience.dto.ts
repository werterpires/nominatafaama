import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateProfessionalExperienceDto {
  @IsNotEmpty()
  job: string

  @IsNotEmpty()
  job_institution: string

  @IsNotEmpty()
  @IsString()
  job_begin_date: string

  @IsString()
  @IsOptional()
  job_end_date: string
}
