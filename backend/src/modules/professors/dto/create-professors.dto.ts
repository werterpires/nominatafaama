import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateProfessorAssignmentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  assignments: string
}
