import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class UpdateLanguageTypeDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    language: string;
  
    @IsNotEmpty()
    @IsNumber()
    language_id: number;
}
