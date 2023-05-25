import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class UpdateCourseDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  course_id: number

  @IsNotEmpty()
  course_area: string

  @IsNotEmpty()
  institution: string

  @IsNotEmpty()
  @IsDateString()
  begin_date: string

  @IsDateString()
  @IsOptional()
  conclusion_date?: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
