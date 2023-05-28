import {IsInt, Min, IsBoolean, IsNotEmpty, IsOptional} from 'class-validator'

export class UpdateRelatedMinistryDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  related_ministry_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ministry_type_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  priority: number
}
