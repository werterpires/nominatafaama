import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'

export class CreateEvangelisticExperienceDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  project: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  place: string

  @IsNotEmpty()
  @IsDateString()
  exp_begin_date: string

  @IsNotEmpty()
  @IsDateString()
  exp_end_date: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  evang_exp_type_id: number
}
