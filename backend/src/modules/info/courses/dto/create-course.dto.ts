import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCourseDto {
  @IsNotEmpty()
  course_area: string

  @IsNotEmpty()
  institution: string

  @IsNotEmpty()
  @IsString()
  begin_date: string

  @IsString()
  @IsOptional()
  conclusion_date?: string
}
