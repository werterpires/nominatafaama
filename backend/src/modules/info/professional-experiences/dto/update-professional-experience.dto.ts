import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class UpdateProfessionalExperienceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  experience_id: number

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

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
