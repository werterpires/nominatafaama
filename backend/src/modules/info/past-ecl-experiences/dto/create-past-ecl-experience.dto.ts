import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePastEclExpDto {
  @IsNotEmpty()
  function: string

  @IsNotEmpty()
  place: string

  @IsNotEmpty()
  @IsString()
  past_exp_begin_date: string

  @IsNotEmpty()
  @IsString()
  past_exp_end_date: string
}
