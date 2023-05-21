import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateHiringStatusDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  hiring_status_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  hiring_status_description: string;

}