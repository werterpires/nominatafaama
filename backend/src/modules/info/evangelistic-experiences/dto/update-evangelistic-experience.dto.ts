import { IsNotEmpty, IsString, Length, IsDateString, IsInt, Min, IsBoolean } from "class-validator";

export class UpdateEvangelisticExperienceDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  project: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  place: string;

  @IsNotEmpty()
  @IsDateString()
  exp_begin_date: string;

  @IsNotEmpty()
  @IsDateString()
  exp_end_date: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  evang_exp_type_id: number;

  @IsNotEmpty()
  @IsBoolean()
  evang_exp_approved: boolean;
}
