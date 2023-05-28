import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator'

export class UpdatePastEclExpDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  past_ecl_id: number

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

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
