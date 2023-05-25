import { IsNotEmpty, IsInt, Min, ArrayNotEmpty, IsArray } from "class-validator";

export class CreateEclExperienceDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    ecl_exp_type_id: number;
  }


  