import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  IsString,
  MinLength,
  Length,
} from 'class-validator'

export class UpdateChildDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  child_id: number

  @IsNotEmpty()
  @IsDateString()
  child_birth_date: string

  @IsNotEmpty()
  @IsInt()
  marital_status_id: number

  @IsNotEmpty()
  @IsInt()
  person_id: number

  @IsNotEmpty()
  @IsString()
  study_grade: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  student_id: number

  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Length(11)
  cpf: string
}
