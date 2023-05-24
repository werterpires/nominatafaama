import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class UpdateEndowmentTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    endowment_type_name: string;

    @IsNotEmpty()
    @IsNumber()
    application: number;

    @IsNotEmpty()
    @IsNumber()
    endowment_type_id: number;
}
