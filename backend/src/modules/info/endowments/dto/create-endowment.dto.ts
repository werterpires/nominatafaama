import {IsNotEmpty, IsInt, Min, IsBoolean, IsOptional} from 'class-validator'

export class CreateEndowmentDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  endowment_type_id: number
}
