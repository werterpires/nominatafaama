import {
  IsNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateEndowmentDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  endowment_type_id: number

  @IsNotEmpty()
  @IsString()
  year: string

  @IsNotEmpty()
  @IsString()
  place: string
}
