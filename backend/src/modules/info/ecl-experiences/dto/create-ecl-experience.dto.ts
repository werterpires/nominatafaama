import { IsNotEmpty, IsInt, Min, ArrayNotEmpty, IsArray } from 'class-validator'

export class CreateEclExperienceDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ecl_exp_type_ids: number[]
}
