import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateNominataDto {
  @IsString()
  @Length(4, 4)
  year: string

  @IsString()
  orig_field_invites_begin: string
}
