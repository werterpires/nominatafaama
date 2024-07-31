import {
  IsString,
  Length,
  IsInt,
  Min,
  IsBoolean,
  IsNotEmpty,
  IsUrl,
  IsOptional
} from 'class-validator'

export class UpdateEndowmentDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  endowment_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  endowment_type_id: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  person_id: number

  @IsNotEmpty()
  @IsString()
  year: string

  @IsNotEmpty()
  @IsString()
  place: string
}
