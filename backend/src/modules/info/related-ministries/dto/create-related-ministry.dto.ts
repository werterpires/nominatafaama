import {IsNotEmpty, IsInt, Min, IsBoolean, IsOptional} from 'class-validator'

export class CreateRelatedMinistryDto {
  @IsNotEmpty()
  @IsInt()
  ministry_type_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  priority: number
}
