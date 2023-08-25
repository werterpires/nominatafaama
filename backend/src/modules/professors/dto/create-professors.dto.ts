import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateProfessorAssignmentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  assignments: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  cpf?: string
}
