import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePreviousMarriageDto {
  @IsNotEmpty()
  @IsString()
  marriage_end_date: string
}
