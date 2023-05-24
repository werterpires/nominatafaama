import { IsNotEmpty, IsString, Length, IsInt } from 'class-validator';

export class CreateEndowmentTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    endowment_type_name: string;

    @IsNotEmpty()
    @IsInt()
    application: number;
}
