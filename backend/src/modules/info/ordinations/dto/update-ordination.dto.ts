import {IsNotEmpty, IsInt, Min, IsBoolean, IsOptional} from 'class-validator'

export class UpdateOrdinationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ordination_id: number

  @IsNotEmpty()
  ordination_name: string

  @IsNotEmpty()
  place: string

  @IsNotEmpty()
  @IsInt()
  year: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number
}
