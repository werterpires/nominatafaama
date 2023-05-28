import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

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
  @IsString()
  begin_date: string

  @IsString()
  @IsOptional()
  conclusion_date?: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
