import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLanguageTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    language: string;
}
