import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateEvangExpTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    evang_exp_type_name: string;
}
