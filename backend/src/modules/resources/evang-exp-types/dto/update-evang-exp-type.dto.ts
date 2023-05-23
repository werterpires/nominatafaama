import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class UpdateEvangExpTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    evang_exp_type_name: string;
  
    @IsNotEmpty()
    @IsNumber()
    evang_exp_type_id: number;
}
