import {IsNotEmpty, IsDateString} from 'class-validator'

export class CreatePreviousMarriageDto {
  @IsNotEmpty()
  @IsDateString()
  marriage_end_date: string
}
