import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class UpdateEclExpTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    ecl_exp_type_name: string;
  
    @IsNotEmpty()
    @IsNumber()
    ecl_exp_type_id: number;
}
