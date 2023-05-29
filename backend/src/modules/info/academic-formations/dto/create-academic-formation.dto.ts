import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

export class CreateAcademicFormationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  course_area: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  institution: string

  @IsNotEmpty()
  @IsString()
  begin_date: string

  @IsOptional()
  @IsString()
  conclusion_date: string | null

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  degree_id: number
}
