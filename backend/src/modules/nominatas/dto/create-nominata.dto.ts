import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateNominataDto {}

export class CreateAcademicDegreeDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  degree_name: string
}
