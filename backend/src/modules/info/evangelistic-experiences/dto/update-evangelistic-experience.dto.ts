import {
  IsNotEmpty,
  IsString,
  Length,
  IsDateString,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator'

export class UpdateEvangelisticExperienceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  evang_exp_id

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  project: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  place: string

  @IsNotEmpty()
  @IsString()
  exp_begin_date: string

  @IsNotEmpty()
  @IsString()
  exp_end_date: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  evang_exp_type_id: number
}
