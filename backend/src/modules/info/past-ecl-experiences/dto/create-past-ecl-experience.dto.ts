import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class CreatePastEclExpDto {
  @IsNotEmpty()
  function: string

  @IsNotEmpty()
  place: string

  @IsNotEmpty()
  @IsDateString()
  past_exp_begin_date: string

  @IsNotEmpty()
  @IsDateString()
  past_exp_end_date: string
}
