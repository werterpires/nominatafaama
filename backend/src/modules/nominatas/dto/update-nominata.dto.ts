import { IsNumber, IsNumberString, IsString, Length } from 'class-validator'

export class UpdateNominataDto {
  @IsNumber()
  nominata_id: number

  @IsString()
  @Length(4, 4)
  year: string

  @IsString()
  orig_field_invites_begin: string

  @IsString()
  @Length(1, 4000)
  director_words: string
}
