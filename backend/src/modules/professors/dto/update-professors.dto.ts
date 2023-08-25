import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsOptional,
} from 'class-validator'

export class UpdateProfessorAssgnmentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  assignments: string

  @IsNotEmpty()
  @IsNumber()
  professor_id: number

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  cpf?: string
}
