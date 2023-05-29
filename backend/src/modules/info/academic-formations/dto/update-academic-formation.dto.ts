import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator'

export class UpdateAcademicFormationDto {
  @IsString()
  @Length(1, 250)
  course_area: string

  @IsString()
  @Length(1, 250)
  institution: string

  @IsString()
  begin_date: string

  @IsOptional()
  @IsString()
  conclusion_date: string | null

  @IsInt()
  @Min(1)
  degree_id: number

  @IsInt()
  @Min(1)
  formation_id: number
}
