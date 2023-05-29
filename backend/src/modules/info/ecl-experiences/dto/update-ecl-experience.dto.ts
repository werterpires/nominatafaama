import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  ArrayNotEmpty,
  IsArray,
  Min,
} from 'class-validator'

export class UpdateExperiencesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ecl_exp_type_id: number[]
}
