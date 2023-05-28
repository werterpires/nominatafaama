import {IsNotEmpty, IsInt, Min, IsBoolean} from 'class-validator'

export class CreateOrdinationDto {
  @IsNotEmpty()
  ordination_name: string

  @IsNotEmpty()
  place: string

  @IsNotEmpty()
  @IsInt()
  year: number
}
