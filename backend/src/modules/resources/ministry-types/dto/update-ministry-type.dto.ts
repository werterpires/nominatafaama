import { IsNotEmpty, IsString, Length, IsBoolean, IsNumber } from 'class-validator';

export class UpdateMinistryTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    ministry_type_name: string;

    @IsNotEmpty()
    @IsNumber()
    ministry_type_id: number;
}
