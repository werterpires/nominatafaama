import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsDateString,
  IsOptional,
  IsString,
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
  @IsString()
  job_begin_date: string

  @IsOptional()
  @IsString()
  job_end_date: string | null

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
