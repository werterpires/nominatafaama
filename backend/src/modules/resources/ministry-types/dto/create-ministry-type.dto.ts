import { IsNotEmpty, IsString, Length, IsBoolean } from 'class-validator';

export class CreateMinistryTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    ministry_type_name: string;
}
