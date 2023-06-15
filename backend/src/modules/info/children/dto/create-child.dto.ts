import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsString,
  MinLength,
  Length,
} from 'class-validator'

export class CreateChildDto {
  @IsNotEmpty()
  @IsString()
  child_birth_date: string

  @IsNotEmpty()
  @IsInt()
  marital_status_id: number

  @IsNotEmpty()
  @IsString()
  study_grade: string

  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Length(11)
  cpf: string
}
