import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class CreateCourseDto {
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
}
