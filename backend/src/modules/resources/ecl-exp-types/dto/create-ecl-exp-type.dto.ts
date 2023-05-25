import {IsNotEmpty, IsString, Length} from 'class-validator';

export class CreateEclExpTypeDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  ecl_exp_type_name: string;
}
