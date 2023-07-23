import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator'

export class UpdateProfessorAssgnment {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  assignments: string

  @IsNotEmpty()
  @IsNumber()
  professor_id: number
}
