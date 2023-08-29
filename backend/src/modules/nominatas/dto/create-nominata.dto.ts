import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

export class CreateNominataDto {
  @IsString()
  @Length(4, 4)
  year: string

  @IsString()
  orig_field_invites_begin: string

  @IsString()
  @Length(1, 7000)
  director_words: string

  @IsNumber()
  director: number
}
