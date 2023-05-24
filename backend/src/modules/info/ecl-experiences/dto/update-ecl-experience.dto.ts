import { IsNotEmpty, IsInt, IsBoolean, ArrayNotEmpty, IsArray, Min } from "class-validator";

export class UpdateEclExperienceDto {

  @IsNotEmpty()
  @IsInt()
  ecl_exp_id: number;

  @IsNotEmpty()
  @IsInt()
  ecl_exp_type_id: number;

}

export class UpdateExperiencesDto {
  @IsNotEmpty()
  @IsInt()
  ecl_exp_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ecl_exp_type_id: number[];
}